import { ApiError } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { BadRequestError } from 'src/common/errors/bad-request.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { ServiceUnavailableError } from 'src/common/errors/service-unavailable.error';
import { vi } from 'vitest';

import { GeminiService } from './gemini.service';

import { MOCK } from 'src/common/constants/mock';

import type { Logger } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

const { mockGenerateContent, mockList } = vi.hoisted(() => ({
	mockGenerateContent: vi.fn(),
	mockList: vi.fn(),
}));

vi.mock('@google/genai', () => {
	return {
		GoogleGenAI: class {
			models = {
				generateContent: mockGenerateContent,
				list: mockList,
			};
		},
		ApiError: class extends Error {
			status: number;
			constructor(info: { message: string; status: number }) {
				super(info.message);
				this.status = info.status;
				this.name = 'ApiError';
			}
		},
	};
});

describe('GeminiService', () => {
	let service: GeminiService;
	let configService: ConfigService;

	const mockAiConfig = {
		apiKey: MOCK.AI.API_KEY,
		model: MOCK.AI.MODEL,
	};

	beforeEach(async () => {
		vi.clearAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GeminiService,
				{
					provide: ConfigService,
					useValue: {
						get: vi.fn((key: string) => {
							if (key === 'ai') return mockAiConfig;
							if (key === 'isProduction') return false;
							return null;
						}),
					},
				},
			],
		}).compile();

		service = module.get<GeminiService>(GeminiService);
		configService = module.get<ConfigService>(ConfigService);

		vi.spyOn(
			service as unknown as { sleep: (ms: number) => Promise<void> },
			'sleep',
		).mockResolvedValue(undefined);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('sendMessage', () => {
		const mockRequest = {
			contents: [{ role: 'user' as const, parts: [{ text: 'Hello' }] }],
		};

		const mockResponse = {
			candidates: [
				{
					content: {
						role: 'model',
						parts: [{ text: MOCK.AI.MESSAGE }],
					},
				},
			],
		};

		it('should send a message and return the content', async () => {
			mockGenerateContent.mockResolvedValue(mockResponse);

			const result = await service.sendMessage(mockRequest);

			expect(result).toEqual(mockResponse);
			expect(mockGenerateContent).toHaveBeenCalledWith({
				model: MOCK.AI.MODEL,
				contents: mockRequest.contents,
				config: {},
			});
		});

		it('should use default model if model is missing in config', async () => {
			vi.spyOn(configService, 'get').mockImplementation((key: string) => {
				if (key === 'ai') return { apiKey: mockAiConfig.apiKey };
				if (key === 'isProduction') return false;
				return null;
			});

			const testModule = await Test.createTestingModule({
				providers: [
					GeminiService,
					{
						provide: ConfigService,
						useValue: {
							get: vi.fn((key: string) => {
								if (key === 'ai') return { apiKey: mockAiConfig.apiKey };
								if (key === 'isProduction') return false;
								return null;
							}),
						},
					},
				],
			}).compile();
			const testService = testModule.get<GeminiService>(GeminiService);
			mockGenerateContent.mockResolvedValue(mockResponse);

			await testService.sendMessage(mockRequest);

			expect(mockGenerateContent).toHaveBeenCalledWith(
				expect.objectContaining({
					model: 'gemini-3.1-flash-lite',
				}),
			);
		});

		it('should throw ServiceUnavailableError if response is blocked', async () => {
			const blockedResponse = {
				promptFeedback: { blockReason: 'SAFETY' },
			};
			mockGenerateContent.mockResolvedValue(blockedResponse);

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(ServiceUnavailableError);
		});

		it('should handle 429 Too Many Requests as ServiceUnavailableError', async () => {
			const error = new ApiError({ message: 'Quota exceeded', status: 429 });
			mockGenerateContent.mockRejectedValue(error);

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(ServiceUnavailableError);
		});

		it('should handle 400 Bad Request', async () => {
			const error = new ApiError({ message: 'Invalid request', status: 400 });
			mockGenerateContent.mockRejectedValue(error);

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(BadRequestError);
		});

		it('should handle 404 Not Found', async () => {
			const error = new ApiError({ message: 'Model not found', status: 404 });
			mockGenerateContent.mockRejectedValue(error);

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(InternalServerError);
		});

		it('should handle 403 Forbidden', async () => {
			const error = new ApiError({ message: 'Forbidden', status: 403 });
			mockGenerateContent.mockRejectedValue(error);

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(InternalServerError);
		});

		it('should handle unexpected status codes', async () => {
			const error = new ApiError({ message: "I'm a teapot", status: 418 });
			mockGenerateContent.mockRejectedValue(error);

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(InternalServerError);
		});

		it('should handle network errors (non-ApiError)', async () => {
			mockGenerateContent.mockRejectedValue(new Error('Network Error'));

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(ServiceUnavailableError);
		});
	});

	describe('onModuleInit', () => {
		const mockModels = [
			{
				name: 'models/gemini-2.5-flash',
				inputTokenLimit: 30000,
				outputTokenLimit: 2048,
			},
			{
				name: 'models/gemini-ultra',
				inputTokenLimit: 1000000,
				outputTokenLimit: 4096,
			},
		];

		it('should log available models in non-production environment', async () => {
			const mockPager = {
				[Symbol.asyncIterator]: async function* () {
					for (const model of mockModels) {
						yield model;
					}
				},
			};
			mockList.mockResolvedValue(mockPager);
			const loggerSpy = vi.spyOn((service as unknown as { logger: Logger }).logger, 'debug');

			await service.onModuleInit();

			expect(mockList).toHaveBeenCalled();
			expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('gemini-2.5-flash'));
			expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('30K'));
		});

		it('should do nothing in production environment', async () => {
			vi.spyOn(configService, 'get').mockImplementation((key: string) => {
				if (key === 'isProduction') return true;
				if (key === 'ai') return mockAiConfig;
				return null;
			});

			await service.onModuleInit();

			expect(mockList).not.toHaveBeenCalled();
		});

		it('should handle error when listing models fails', async () => {
			mockList.mockRejectedValue(new Error('Failed'));
			const loggerSpy = vi.spyOn((service as unknown as { logger: Logger }).logger, 'error');

			await service.onModuleInit();

			expect(loggerSpy).toHaveBeenCalledWith('Failed to list Gemini models', expect.any(Error));
		});
	});
});
