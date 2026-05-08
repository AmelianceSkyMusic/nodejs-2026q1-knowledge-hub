import { GenerateContentConfig } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ArticleAnalysisSchema } from 'shared/ai/schemas/article-analysis.schema';
import { ArticleTranslationSchema } from 'shared/ai/schemas/article-translation.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { ArticlesService } from 'src/articles/articles.service';

import { AiCacheService } from './ai-cache.service';
import { AnalyzeArticleDto } from './dto/analyze-article.dto';
import { GenerateMessageDto } from './dto/generate-message.dto';
import { SummarizeArticleDto } from './dto/summarize-article.dto';
import { TranslateArticleDto } from './dto/translate-article.dto';
import { GeminiRequest, GeminiService } from './gemini.service';
import { chatPrompt } from './prompts/chat.prompt';
import { getAnalyzeArticlePrompt } from './prompts/get-analyze-article-prompt';
import { generateArticlePrompt } from './prompts/get-article.prompt';
import { getSummarizeArticleMaxLengthPrompt } from './prompts/get-summarize-article-max-length.prompt';
import { getTranslateArticlePrompt } from './prompts/get-translate-article.prompt';
import { masterPrompt } from './prompts/master.prompt';
import { AiRepository } from './repositories/ai.repository';
import { generateGeminiContent } from './utils/generate-gemini-content';
import { parseAiResponse } from './utils/parse-ai-response';
import { prepareAiResponse } from './utils/prepare-ai-response';

import { GEMINI_CONFIGS } from './constants/gemini-configs';

@Injectable()
export class AiService {
	constructor(
		private readonly aiRepository: AiRepository,
		private readonly geminiService: GeminiService,
		private readonly articlesService: ArticlesService,
		private readonly aiCacheService: AiCacheService,
	) {}

	async summarizeArticle(articleId: Id, summarizeArticleDto: SummarizeArticleDto) {
		const article = await this.articlesService.findOne(articleId);
		const cacheKey = `ai/summarize/${articleId}-${summarizeArticleDto.maxLength}-${article.updatedAt.getTime()}`;
		const cached = await this.aiCacheService.getCache<{
			articleId: Id;
			summary: string;
			originalLength: number;
			summaryLength: number;
		}>(cacheKey);
		if (cached) {
			this.aiRepository.recordCacheHit();
			return cached;
		}
		this.aiRepository.recordCacheMiss();

		const articleContent = generateArticlePrompt(article);

		const maxLengthPrompt = getSummarizeArticleMaxLengthPrompt(summarizeArticleDto.maxLength);
		const systemInstruction = `${masterPrompt}\n${maxLengthPrompt}`;

		const { messageText, tokens, latency } = await this.runGemini(
			articleContent,
			systemInstruction,
			GEMINI_CONFIGS.TECH,
		);

		this.aiRepository.updateStats('ai/summarize', tokens, latency);

		const cleanSummary = prepareAiResponse(messageText);

		const response = {
			articleId,
			summary: cleanSummary,
			originalLength: article.content.length,
			summaryLength: cleanSummary.length,
		};
		await this.aiCacheService.setCache(cacheKey, response);

		return response;
	}

	async translateArticle(articleId: Id, translateArticleDto: TranslateArticleDto) {
		const article = await this.articlesService.findOne(articleId);
		const source = translateArticleDto.sourceLanguage || 'auto';
		const cacheKey = `ai/translate/${articleId}-${source}-${translateArticleDto.targetLanguage}-${article.updatedAt.getTime()}`;
		const cached = await this.aiCacheService.getCache<{
			articleId: Id;
			translatedText: string;
			detectedLanguage: string;
		}>(cacheKey);
		if (cached) {
			this.aiRepository.recordCacheHit();
			return cached;
		}
		this.aiRepository.recordCacheMiss();

		const articleContent = generateArticlePrompt(article);

		const translationPrompt = getTranslateArticlePrompt(
			translateArticleDto.sourceLanguage,
			translateArticleDto.targetLanguage,
		);
		const systemInstruction = `${masterPrompt}\n${translationPrompt}`;

		const { messageText, tokens, latency } = await this.runGemini(
			articleContent,
			systemInstruction,
			GEMINI_CONFIGS.TECH,
		);

		const translatedArticle = parseAiResponse(
			ArticleTranslationSchema.omit({ articleId: true }),
			messageText,
		);

		this.aiRepository.updateStats('ai/translate', tokens, latency);

		const response = {
			articleId,
			translatedText: translatedArticle.translatedText,
			detectedLanguage: translatedArticle.detectedLanguage,
		};
		await this.aiCacheService.setCache(cacheKey, response);

		return response;
	}

	async analyzeArticle(articleId: Id, analyzeArticleDto: AnalyzeArticleDto) {
		const article = await this.articlesService.findOne(articleId);

		const articleContent = generateArticlePrompt(article);

		const analyzeArticlePrompt = getAnalyzeArticlePrompt(analyzeArticleDto.task);
		const systemInstruction = `${masterPrompt}\n${analyzeArticlePrompt}`;

		const { messageText, tokens, latency } = await this.runGemini(
			articleContent,
			systemInstruction,
			GEMINI_CONFIGS.TECH,
		);

		const analyzedArticle = parseAiResponse(
			ArticleAnalysisSchema.omit({ articleId: true }),
			messageText,
		);

		this.aiRepository.updateStats('ai/analyze', tokens, latency);

		return {
			articleId,
			analysis: analyzedArticle.analysis,
			suggestions: analyzedArticle.suggestions,
			severity: analyzedArticle.severity,
		};
	}

	async generateMessage(userId: Id, generateMessageDto: GenerateMessageDto) {
		const { message } = generateMessageDto;

		let chatSession = this.aiRepository.getByUserId(userId);
		if (!chatSession) chatSession = this.aiRepository.createByUser(userId);

		const { messages } = this.aiRepository.addMessageByUserId(userId, {
			role: 'user',
			parts: [{ text: message }],
		});

		const content: GeminiRequest = {
			contents: messages,
			config: {
				...GEMINI_CONFIGS.CHAT,
				systemInstruction: {
					parts: [{ text: chatPrompt }],
				},
			},
		};

		const { messageText, tokens, latency } = await this.sendGeminiMessage(content);

		this.aiRepository.addMessageByUserId(userId, {
			role: 'model',
			parts: [{ text: messageText }],
		});

		this.aiRepository.updateStats('ai/generate', tokens, latency);

		return { message: messageText };
	}

	async getStatistics() {
		return this.aiRepository.getStatistics();
	}

	private async sendGeminiMessage(content: GeminiRequest) {
		const start = performance.now();
		const geminiResponse = await this.geminiService.sendMessage(content);
		const latency = performance.now() - start;

		const messageText = geminiResponse.text || '';
		const tokens = geminiResponse.usageMetadata?.totalTokenCount;

		return { messageText, tokens, latency };
	}

	private async runGemini(prompt: string, systemPrompt?: string, config?: GenerateContentConfig) {
		const content = generateGeminiContent(prompt, systemPrompt, config);

		return this.sendGeminiMessage(content);
	}
}
