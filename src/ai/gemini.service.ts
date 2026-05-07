import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, retry, timer } from 'rxjs';
import { BadRequestError } from 'src/common/errors/bad-request.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { ServiceUnavailableError } from 'src/common/errors/service-unavailable.error';

import { GeminiErrorResponse } from './types/gemini/error.types';
import { GeminiRequest } from './types/gemini/request.types';
import { GeminiResponse } from './types/gemini/response.types';

import { MODELS } from './constants/models';

type GeminiModel = {
	name: string;
	inputTokenLimit?: number;
	outputTokenLimit?: number;
};

type GeminiListModelsResponse = {
	models: GeminiModel[];
};

@Injectable()
export class GeminiService implements OnModuleInit {
	private readonly logger = new Logger(GeminiService.name);
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {}

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

						const localConfig = (MODELS.GEMINI as Record<string, unknown>)[name] as
							| { rpm: number; tpm: number; rpd: number }
							| undefined;
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

	async sendMessage(content: GeminiRequest) {
		const isProduction = this.configService.get<boolean>('isProduction');
		const aiConfig = this.configService.get('ai');
		if (!aiConfig) throw new InternalServerError('AI config missing');
		const { baseUrl, model, apiKey } = aiConfig;

		const geminiModel = model || MODELS.GEMINI['gemma-3-27b-it'].model;
		const promptContent = this.prepareContent(content, geminiModel);
		const url = `${baseUrl}/v1beta/models/${geminiModel}:generateContent`;

		const headers = {
			'x-goog-api-key': apiKey,
			'Content-Type': 'application/json',
		};

		const retryableStatuses = [429, 500, 503, 504];
		const maxRetries = 3;

		const { data } = await firstValueFrom(
			this.httpService
				.post<GeminiResponse | GeminiErrorResponse>(url, promptContent, {
					headers,
				})
				.pipe(
					retry({
						count: maxRetries,
						delay: (error, retryCount) => {
							if (retryableStatuses.includes(error?.response?.status)) {
								const delay = Math.pow(2, retryCount) * 1000;
								const attempt = retryCount + 1;
								this.logger.warn(
									`Gemini retry attempt ${attempt}/${maxRetries} (status: ${error?.response?.status}) in ${delay / 1000}s`,
								);
								return timer(delay);
							}
							throw error;
						},
					}),
					catchError((error) => {
						const status = error?.response?.status;
						const data = error.response?.data?.error;
						const errorMessage = data?.message || error.message;

						if (!isProduction) {
							this.logger.debug(`Gemini error message: ${errorMessage}`);
						}

						const errorData = JSON.stringify(
							{
								status,
								reason: error.response?.data?.error?.status,
								model: geminiModel,
							},
							null,
							3,
						);

						if (!status) {
							this.logger.error(`Network error calling Gemini ${errorData}`);
							throw new ServiceUnavailableError('AI service unavailable');
						} else if (retryableStatuses.includes(status)) {
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
					}),
				),
		);

		if ('promptFeedback' in data && data.promptFeedback?.blockReason) {
			this.logger.warn(`AI blocked response: ${data.promptFeedback.blockReason}`);
			throw new ServiceUnavailableError('AI Service is currently busy. Try again later');
		}

		return data;
	}

	private prepareContent(content: GeminiRequest, model: string) {
		if (!model.startsWith('gemma')) return content;

		const lastContent = content.contents[content.contents.length - 1];
		const lastPart = lastContent?.parts?.[0];
		const lastMessage = lastPart && 'text' in lastPart ? lastPart.text : '';

		const systemPart = content?.systemInstruction?.parts?.[0];
		const systemInstruction = systemPart && 'text' in systemPart ? systemPart.text : '';
		const messageWithInstructions = `# System Instruction:\n${systemInstruction}\n\n# Message:\n${lastMessage}`;
		const messagesWithoutLast = content.contents.slice(0, content.contents.length - 1);
		return {
			contents: [
				...messagesWithoutLast,
				{ ...lastContent, parts: [{ text: messageWithInstructions }] },
			],
		};
	}

	private async listModels() {
		const aiConfig = this.configService.get('ai');
		if (!aiConfig) throw new InternalServerError('AI config missing');
		const { baseUrl, apiKey } = aiConfig;

		const url = `${baseUrl}/v1beta/models?key=${apiKey}`;

		const { data } = await firstValueFrom(
			this.httpService.get<GeminiListModelsResponse>(url).pipe(
				catchError((error) => {
					this.logger.error(`Failed to list models: ${error.message}`);
					throw error;
				}),
			),
		);

		return data.models || [];
	}

	private formatTokens(n: number): string {
		if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
		if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
		return n.toString();
	}
}
