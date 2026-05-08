import {
	ApiError,
	GenerateContentParameters,
	GenerateContentResponse,
	GoogleGenAI,
	setDefaultBaseUrls,
} from '@google/genai';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BadRequestError } from 'src/common/errors/bad-request.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { ServiceUnavailableError } from 'src/common/errors/service-unavailable.error';

import { MODELS } from './constants/models';

import type { GeminiModels } from './constants/models';

type GeminiModel = {
	name: string;
	inputTokenLimit?: number;
	outputTokenLimit?: number;
};

export type GeminiRequest = Omit<GenerateContentParameters, 'model'>;

@Injectable()
export class GeminiService implements OnModuleInit {
	private readonly logger = new Logger(GeminiService.name);
	private client: GoogleGenAI;

	constructor(private readonly configService: ConfigService) {
		const aiConfig = this.configService.get('ai');
		if (!aiConfig) throw new InternalServerError('AI config missing');
		const { apiKey, baseUrl } = aiConfig;

		if (baseUrl) setDefaultBaseUrls({ geminiUrl: baseUrl });

		this.client = new GoogleGenAI({ apiKey });
	}

	async onModuleInit() {
		const isProduction = this.configService.get<boolean>('isProduction');
		if (!isProduction) {
			try {
				const models = await this.listModels();
				const formattedModels = models
					.map((model: GeminiModel) => {
						const name = model.name.replace('models/', '');
						const inputLimit = model.inputTokenLimit
							? this.formatTokens(model.inputTokenLimit)
							: '?';
						const outputLimit = model.outputTokenLimit
							? this.formatTokens(model.outputTokenLimit)
							: '?';

						const localConfig =
							name in MODELS.GEMINI ? MODELS.GEMINI[name as GeminiModels] : undefined;
						let quotaInfo = '';
						if (localConfig) {
							const rpm = localConfig.rpm;
							const tpm =
								localConfig.tpm === Infinity ? '∞' : this.formatTokens(localConfig.tpm);
							const rpd = localConfig.rpd;
							quotaInfo = ` [RPM: ${rpm}, TPM: ${tpm}, RPD: ${rpd}]`;
						}

						return `\n - ${name} (In: ${inputLimit}, Out: ${outputLimit})${quotaInfo}`;
					})
					.join('');
				this.logger.debug(`Available Gemini models:${formattedModels}`);
			} catch (e) {
				this.logger.error('Failed to list Gemini models', e);
			}
		}
	}

	async sendMessage(content: GeminiRequest): Promise<GenerateContentResponse> {
		const isProduction = this.configService.get<boolean>('isProduction');
		const aiConfig = this.configService.get('ai');
		const geminiModel = aiConfig?.model || MODELS.GEMINI['gemma-4-26b-a4b-it'].model;

		const retryableStatuses = [429, 500, 503, 504];
		const maxRetries = 3;
		let lastError: unknown;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const response = await this.client.models.generateContent({
					model: geminiModel,
					contents: content.contents,
					config: content.config || {},
				});

				if ('promptFeedback' in response && response.promptFeedback?.blockReason) {
					this.logger.warn(`AI blocked response: ${response.promptFeedback.blockReason}`);
					throw new ServiceUnavailableError('AI Service is currently busy. Try again later');
				}

				return response;
			} catch (error) {
				lastError = error;

				if (error instanceof ServiceUnavailableError && error.message.includes('busy')) {
					throw error;
				}

				if (error instanceof ApiError) {
					const status = error.status;

					if (attempt < maxRetries && status && retryableStatuses.includes(status)) {
						const delay = Math.pow(2, attempt + 1) * 1000;
						this.logger.warn(
							`Gemini retry attempt ${attempt + 1}/${maxRetries} (status: ${status}) in ${delay / 1000}s`,
						);
						await this.sleep(delay);
						continue;
					}

					if (!isProduction) {
						let errorMessage = error.message;
						try {
							const parsed = JSON.parse(error.message);
							errorMessage = parsed.error?.message || error.message;
							this.logger.debug(`Gemini error message: ${errorMessage}`);
						} catch {}
					}

					const errorData = JSON.stringify(
						{
							status,
							model: geminiModel,
						},
						null,
						3,
					);

					if (status === 429 || (status && status >= 500)) {
						this.logger.warn(`Gemini API Transient Issue: ${errorData}`);
						throw new ServiceUnavailableError(
							'AI Service is currently busy. Try again later',
						);
					} else if (status === 400) {
						this.logger.error(`Gemini API Critical Failure: ${errorData}`);
						throw new BadRequestError('Invalid AI request');
					} else if (status === 403) {
						this.logger.error(`Gemini API Critical Failure: ${errorData}`);
						throw new InternalServerError('AI configuration error');
					} else if (status === 404) {
						this.logger.error(`Gemini API Critical Failure: ${errorData}`);
						throw new InternalServerError('AI resource not found');
					}

					this.logger.error(`Unexpected Gemini error: ${errorData}`);
					throw new InternalServerError('Unexpected AI error');
				}

				if (attempt < maxRetries) {
					const delay = Math.pow(2, attempt + 1) * 1000;
					this.logger.warn(
						`Gemini network error, retry attempt ${attempt + 1}/${maxRetries} in ${delay / 1000}s`,
					);
					await this.sleep(delay);
					continue;
				}

				this.logger.error(`Network error calling Gemini: ${error.message}`);
				throw new ServiceUnavailableError('AI service unavailable');
			}
		}

		throw lastError;
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private async listModels(): Promise<GeminiModel[]> {
		try {
			const models: GeminiModel[] = [];
			const pager = await this.client.models.list();

			for await (const model of pager) {
				models.push({
					name: model.name,
					inputTokenLimit: model.inputTokenLimit,
					outputTokenLimit: model.outputTokenLimit,
				});
			}

			return models;
		} catch (error) {
			this.logger.error(`Failed to list models: ${error.message}`);
			throw error;
		}
	}

	private formatTokens(n: number): string {
		if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
		if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
		return n.toString();
	}
}
