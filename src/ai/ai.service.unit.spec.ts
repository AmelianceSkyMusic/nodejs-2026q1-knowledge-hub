import { Test } from '@nestjs/testing';
import { ArticlesService } from 'src/articles/articles.service';
import { vi } from 'vitest';

import { AiCacheService } from './ai-cache.service';
import { AiService } from './ai.service';
import { GeminiService } from './gemini.service';
import { AiRepository } from './repositories/ai.repository';

import { MOCK } from 'src/common/constants/mock';

import type { TestingModule } from '@nestjs/testing';

describe('AiService', () => {
	let service: AiService;
	let aiRepository: AiRepository;
	let geminiService: GeminiService;
	let articlesService: ArticlesService;
	let aiCacheService: AiCacheService;

	const mockArticle = {
		id: MOCK.COMMON.ID,
		title: 'Test Article',
		content: 'Test content',
		updatedAt: new Date(),
		tags: [],
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AiService,
				{
					provide: AiRepository,
					useValue: {
						updateStats: vi.fn(),
						recordCacheHit: vi.fn(),
						recordCacheMiss: vi.fn(),
						getByUserId: vi.fn(),
						createByUser: vi.fn(),
						addMessageByUserId: vi.fn(),
						getStatistics: vi.fn(),
					},
				},
				{
					provide: GeminiService,
					useValue: {
						sendMessage: vi.fn(),
					},
				},
				{
					provide: ArticlesService,
					useValue: {
						findOne: vi.fn(),
					},
				},
				{
					provide: AiCacheService,
					useValue: {
						getCache: vi.fn(),
						setCache: vi.fn(),
					},
				},
			],
		}).compile();

		service = module.get<AiService>(AiService);
		aiRepository = module.get<AiRepository>(AiRepository);
		geminiService = module.get<GeminiService>(GeminiService);
		articlesService = module.get<ArticlesService>(ArticlesService);
		aiCacheService = module.get<AiCacheService>(AiCacheService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('summarizeArticle', () => {
		it('should return cached summary if available', async () => {
			const cachedResponse = { articleId: MOCK.COMMON.ID, summary: 'Cached' };
			vi.spyOn(articlesService, 'findOne').mockResolvedValue(mockArticle as any);
			vi.spyOn(aiCacheService, 'getCache').mockResolvedValue(cachedResponse);

			const result = await service.summarizeArticle(MOCK.COMMON.ID, { maxLength: 'short' });

			expect(result).toEqual(cachedResponse);
			expect(aiRepository.recordCacheHit).toHaveBeenCalled();
		});

		it('should generate and cache summary if not cached', async () => {
			const aiResponse = {
				candidates: [{ content: { parts: [{ text: 'Generated summary' }] } }],
				text: 'Generated summary',
				usageMetadata: { totalTokenCount: 10 },
			};
			vi.spyOn(articlesService, 'findOne').mockResolvedValue(mockArticle as any);
			vi.spyOn(aiCacheService, 'getCache').mockResolvedValue(null);
			vi.spyOn(geminiService, 'sendMessage').mockResolvedValue(aiResponse as any);

			const result = await service.summarizeArticle(MOCK.COMMON.ID, { maxLength: 'short' });

			expect(result.summary).toBe('Generated summary');
			expect(aiRepository.recordCacheMiss).toHaveBeenCalled();
			expect(aiCacheService.setCache).toHaveBeenCalled();
			expect(aiRepository.updateStats).toHaveBeenCalledWith(
				'ai/summarize',
				10,
				expect.any(Number),
			);
		});
	});

	describe('translateArticle', () => {
		it('should return cached translation if available', async () => {
			const cachedResponse = {
				articleId: MOCK.COMMON.ID,
				translatedText: 'Cached',
				detectedLanguage: 'en',
			};
			vi.spyOn(articlesService, 'findOne').mockResolvedValue(mockArticle as any);
			vi.spyOn(aiCacheService, 'getCache').mockResolvedValue(cachedResponse);

			const result = await service.translateArticle(MOCK.COMMON.ID, {
				targetLanguage: 'uk',
				sourceLanguage: 'en',
			});

			expect(result).toEqual(cachedResponse);
			expect(aiRepository.recordCacheHit).toHaveBeenCalled();
		});

		it('should translate article', async () => {
			const aiResponse = {
				usageMetadata: { totalTokenCount: 20 },
				text: JSON.stringify({
					translatedText: 'Translated content',
					detectedLanguage: 'en',
				}),
			};
			vi.spyOn(articlesService, 'findOne').mockResolvedValue(mockArticle as any);
			vi.spyOn(aiCacheService, 'getCache').mockResolvedValue(null);
			vi.spyOn(geminiService, 'sendMessage').mockResolvedValue(aiResponse as any);

			const result = await service.translateArticle(MOCK.COMMON.ID, { targetLanguage: 'uk' });

			expect(result.translatedText).toBe('Translated content');
			expect(aiRepository.updateStats).toHaveBeenCalledWith(
				'ai/translate',
				20,
				expect.any(Number),
			);
		});
	});

	describe('analyzeArticle', () => {
		it('should analyze article', async () => {
			const aiResponse = {
				usageMetadata: { totalTokenCount: 30 },
				text: JSON.stringify({
					analysis: 'Good article',
					suggestions: ['Add more examples'],
					severity: 'info',
				}),
			};
			vi.spyOn(articlesService, 'findOne').mockResolvedValue(mockArticle as any);
			vi.spyOn(geminiService, 'sendMessage').mockResolvedValue(aiResponse as any);

			const result = await service.analyzeArticle(MOCK.COMMON.ID, { task: 'review' });

			expect(result.analysis).toBe('Good article');
			expect(aiRepository.updateStats).toHaveBeenCalledWith(
				'ai/analyze',
				30,
				expect.any(Number),
			);
		});
	});

	describe('generateMessage', () => {
		it('should create session if it does not exist', async () => {
			const aiResponse = {
				candidates: [{ content: { parts: [{ text: 'AI response' }] } }],
				text: 'AI response',
				usageMetadata: { totalTokenCount: 5 },
			};
			vi.spyOn(aiRepository, 'getByUserId').mockReturnValue(null);
			vi.spyOn(aiRepository, 'addMessageByUserId').mockReturnValue({ messages: [] } as any);
			vi.spyOn(geminiService, 'sendMessage').mockResolvedValue(aiResponse as any);

			await service.generateMessage(MOCK.COMMON.ID, { message: 'Hello' });

			expect(aiRepository.createByUser).toHaveBeenCalledWith(MOCK.COMMON.ID);
		});

		it('should reuse existing session', async () => {
			const aiResponse = {
				candidates: [{ content: { parts: [{ text: 'AI response' }] } }],
				text: 'AI response',
				usageMetadata: { totalTokenCount: 5 },
			};
			vi.spyOn(aiRepository, 'getByUserId').mockReturnValue({ messages: [] } as any);
			vi.spyOn(aiRepository, 'addMessageByUserId').mockReturnValue({ messages: [] } as any);
			vi.spyOn(geminiService, 'sendMessage').mockResolvedValue(aiResponse as any);

			await service.generateMessage(MOCK.COMMON.ID, { message: 'Hello' });

			expect(aiRepository.createByUser).not.toHaveBeenCalled();
		});

		it('should generate a chat response', async () => {
			const aiResponse = {
				candidates: [{ content: { parts: [{ text: 'AI response' }] } }],
				text: 'AI response',
				usageMetadata: { totalTokenCount: 5 },
			};
			vi.spyOn(aiRepository, 'getByUserId').mockReturnValue({ messages: [] } as any);
			vi.spyOn(aiRepository, 'addMessageByUserId').mockReturnValue({ messages: [] } as any);
			vi.spyOn(geminiService, 'sendMessage').mockResolvedValue(aiResponse as any);

			const result = await service.generateMessage(MOCK.COMMON.ID, { message: 'Hello' });

			expect(result.message).toBe('AI response');
			expect(aiRepository.updateStats).toHaveBeenCalledWith(
				'ai/generate',
				5,
				expect.any(Number),
			);
		});
	});

	describe('sendGeminiMessage errors and branches', () => {
		it('should throw ServiceUnavailableError if Gemini returns error', async () => {
			vi.spyOn(articlesService, 'findOne').mockResolvedValue(mockArticle as any);
			vi.spyOn(geminiService, 'sendMessage').mockRejectedValue(new Error('fail'));

			await expect(
				service.summarizeArticle(MOCK.COMMON.ID, { maxLength: 'short' }),
			).rejects.toThrow();
		});

		it('should handle empty candidates from Gemini', async () => {
			const aiResponse = {
				candidates: [],
				usageMetadata: { totalTokenCount: 0 },
			};
			vi.spyOn(articlesService, 'findOne').mockResolvedValue(mockArticle as any);
			vi.spyOn(geminiService, 'sendMessage').mockResolvedValue(aiResponse as any);

			const result = await service.summarizeArticle(MOCK.COMMON.ID, { maxLength: 'short' });
			expect(result.summary).toBe('');
		});

		it('should handle missing text in response parts', async () => {
			const aiResponse = {
				candidates: [
					{
						content: {
							parts: [{}],
						},
					},
				],
				usageMetadata: { totalTokenCount: 0 },
			};
			vi.spyOn(articlesService, 'findOne').mockResolvedValue(mockArticle as any);
			vi.spyOn(geminiService, 'sendMessage').mockResolvedValue(aiResponse as any);

			const result = await service.summarizeArticle(MOCK.COMMON.ID, { maxLength: 'short' });
			expect(result.summary).toBe('');
		});
	});

	describe('getStatistics', () => {
		it('should return statistics from repository', async () => {
			const stats = { totalRequests: 10 };
			vi.spyOn(aiRepository, 'getStatistics').mockReturnValue(stats as any);

			const result = await service.getStatistics();

			expect(result).toEqual(stats);
		});
	});
});
