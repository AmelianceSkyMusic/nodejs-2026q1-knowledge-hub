import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, retry, timer } from 'rxjs';
import { BadRequestError } from 'src/common/errors/bad-request.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { ServiceUnavailableError } from 'src/common/errors/service-unavailable.error';

import { GeminiErrorResponse } from './types/gemini/error.types';
import { GeminiRequest } from './types/gemini/request.types';
import { GeminiResponse } from './types/gemini/response.types';

import { MODELS } from './constants/models';

@Injectable()
export class GeminiService {
	private readonly logger = new Logger(GeminiService.name);
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {}

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
		if ('candidates' in data && data.candidates?.[0]) {
			return data.candidates[0].content;
		}
		throw new ServiceUnavailableError('Empty AI response');
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
}
