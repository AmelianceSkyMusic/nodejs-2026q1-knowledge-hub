import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

vi.mock('rxjs', async (importOriginal) => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		timer: vi.fn(() => {
			return of(0);
		}),
	};
});

import { BadRequestError } from 'src/common/errors/bad-request.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { ServiceUnavailableError } from 'src/common/errors/service-unavailable.error';
import { vi } from 'vitest';

import { GeminiService } from './gemini.service';

import { MOCK } from 'src/common/constants/mock';

import type { TestingModule } from '@nestjs/testing';

describe('GeminiService', () => {
	let service: GeminiService;
	let httpService: HttpService;
	let configService: ConfigService;

	const mockAiConfig = {
		baseUrl: MOCK.AI.BASE_URL,
		apiKey: MOCK.AI.API_KEY,
		model: MOCK.AI.MODEL,
	};

	beforeEach(async () => {
		vi.useFakeTimers();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GeminiService,
				{
					provide: HttpService,
					useValue: {
						post: vi.fn(),
						get: vi.fn(),
					},
				},
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
		httpService = module.get<HttpService>(HttpService);
		configService = module.get<ConfigService>(ConfigService);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('sendMessage', () => {
		const mockRequest = {
			contents: [{ role: 'user' as const, parts: [{ text: 'Hello' }] as [{ text: string }] }],
		};

		const mockResponse = {
			data: {
				candidates: [
					{
						content: {
							role: 'model',
							parts: [{ text: MOCK.AI.MESSAGE }],
						},
					},
				],
			},
		};

		it('should send a message and return the content', async () => {
			vi.spyOn(httpService, 'post').mockReturnValue(of(mockResponse as any));

			const result = await service.sendMessage(mockRequest);

			expect(result).toEqual(mockResponse.data);
			expect(httpService.post).toHaveBeenCalledWith(
				expect.stringContaining(MOCK.AI.MODEL),
				mockRequest,
				expect.objectContaining({
					headers: {
						'x-goog-api-key': MOCK.AI.API_KEY,
						'Content-Type': 'application/json',
					},
				}),
			);
		});

		it('should throw InternalServerError if AI config is missing', async () => {
			vi.spyOn(configService, 'get').mockReturnValue(null);

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(InternalServerError);
		});

		it('should use default model if model is missing in config', async () => {
			vi.spyOn(configService, 'get').mockImplementation((key: string) => {
				if (key === 'ai') return { baseUrl: mockAiConfig.baseUrl, apiKey: mockAiConfig.apiKey };
				if (key === 'isProduction') return false;
				return null;
			});
			vi.spyOn(httpService, 'post').mockReturnValue(of(mockResponse as any));

			await service.sendMessage(mockRequest);

			expect(httpService.post).toHaveBeenCalledWith(
				expect.stringContaining('gemini-3.1-flash-lite'),
				expect.anything(),
				expect.anything(),
			);
		});

		it('should not log debug error message in production environment', async () => {
			vi.spyOn(configService, 'get').mockImplementation((key: string) => {
				if (key === 'isProduction') return true;
				if (key === 'ai') return mockAiConfig;
				return null;
			});
			const errorResponse = {
				response: {
					status: 400,
					data: { error: { message: 'Invalid request' } },
				},
			};
			vi.spyOn(httpService, 'post').mockReturnValue(throwError(() => errorResponse));
			const loggerSpy = vi.spyOn((service as any).logger, 'debug');

			await expect(service.sendMessage(mockRequest)).rejects.toThrow();

			expect(loggerSpy).not.toHaveBeenCalled();
		});

		it('should throw ServiceUnavailableError if response is blocked', async () => {
			const blockedResponse = {
				data: {
					promptFeedback: { blockReason: 'SAFETY' },
				},
			};
			vi.spyOn(httpService, 'post').mockReturnValue(of(blockedResponse as any));

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(ServiceUnavailableError);
		});

		it('should throw ServiceUnavailableError if response is empty', async () => {
			const emptyResponse = { data: {} };
			vi.spyOn(httpService, 'post').mockReturnValue(of(emptyResponse as any));

			const result = await service.sendMessage(mockRequest);
			expect(result).toEqual({});
		});

		it('should handle 400 Bad Request', async () => {
			const errorResponse = {
				response: {
					status: 400,
					data: { error: { message: 'Invalid request', status: 'INVALID_ARGUMENT' } },
				},
			};
			vi.spyOn(httpService, 'post').mockReturnValue(throwError(() => errorResponse));

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(BadRequestError);
		});

		it('should handle 429 Too Many Requests as ServiceUnavailableError', async () => {
			const errorResponse = {
				response: {
					status: 429,
					data: { error: { message: 'Quota exceeded' } },
				},
			};
			vi.spyOn(httpService, 'post').mockReturnValue(throwError(() => errorResponse));

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(ServiceUnavailableError);
		});

		it('should handle 404 Not Found', async () => {
			const errorResponse = {
				response: {
					status: 404,
					data: { error: { message: 'Model not found' } },
				},
			};
			vi.spyOn(httpService, 'post').mockReturnValue(throwError(() => errorResponse));

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(InternalServerError);
		});

		it('should handle 403 Forbidden', async () => {
			const errorResponse = {
				response: {
					status: 403,
					data: { error: { message: 'Forbidden' } },
				},
			};
			vi.spyOn(httpService, 'post').mockReturnValue(throwError(() => errorResponse));

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(InternalServerError);
		});

		it('should handle unexpected status codes', async () => {
			const errorResponse = {
				response: {
					status: 418,
					data: { error: { message: "I'm a teapot" } },
				},
			};
			vi.spyOn(httpService, 'post').mockReturnValue(throwError(() => errorResponse));

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(InternalServerError);
		});

		it('should handle network errors (no status)', async () => {
			const errorResponse = { message: 'Network Error' };
			vi.spyOn(httpService, 'post').mockReturnValue(throwError(() => errorResponse));

			await expect(service.sendMessage(mockRequest)).rejects.toThrow(ServiceUnavailableError);
		});
	});

	describe('onModuleInit', () => {
		const mockModelsResponse = {
			data: {
				models: [
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
					{
						name: 'models/small-model',
						inputTokenLimit: 500,
					},
					{
						name: 'models/gemma-4-31b-it',
						inputTokenLimit: 1000000,
					},
					{
						name: 'models/no-limits',
					},
				],
			},
		};

		it('should log available models in non-production environment', async () => {
			vi.spyOn(httpService, 'get').mockReturnValue(of(mockModelsResponse as any));
			const loggerSpy = vi.spyOn((service as any).logger, 'debug');

			await service.onModuleInit();

			expect(httpService.get).toHaveBeenCalled();
			expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('gemini-2.5-flash'));
			expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('30K'));
			expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('1M'));
		});

		it('should do nothing in production environment', async () => {
			vi.spyOn(configService, 'get').mockImplementation((key: string) => {
				if (key === 'isProduction') return true;
				if (key === 'ai') return mockAiConfig;
				return null;
			});

			await service.onModuleInit();

			expect(httpService.get).not.toHaveBeenCalled();
		});

		it('should handle error when listing models fails', async () => {
			vi.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('Failed')));
			const loggerSpy = vi.spyOn((service as any).logger, 'error');

			await service.onModuleInit();

			expect(loggerSpy).toHaveBeenCalledWith('Failed to list Gemini models', expect.any(Error));
		});

		it('should throw InternalServerError if AI config is missing during listModels', async () => {
			vi.spyOn(configService, 'get').mockReturnValue(null);

			await expect((service as any).listModels()).rejects.toThrow(InternalServerError);
		});

		it('should return empty array if models property is missing in response', async () => {
			vi.spyOn(httpService, 'get').mockReturnValue(of({ data: {} } as any));

			const result = await (service as any).listModels();

			expect(result).toEqual([]);
		});
	});
});
