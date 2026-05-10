import { GenerateContentConfig } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { AnalyzeArticle } from 'shared/ai/schemas/analyze-article.schema';
import { ArticleAnalysisSchema } from 'shared/ai/schemas/article-analysis.schema';
import { ArticleTranslationSchema } from 'shared/ai/schemas/article-translation.schema';
import { GenerateMessage } from 'shared/ai/schemas/generate-message.schema';
import { SummarizeArticle } from 'shared/ai/schemas/summarize-article.schema';
import { TranslateArticle } from 'shared/ai/schemas/translate-article.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { ArticlesService } from 'src/articles/articles.service';

import { AiCacheService } from './ai-cache.service';
import { GeminiService } from './gemini/gemini.service';
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

import type { SendMessage } from './gemini/gemini.service';

@Injectable()
export class AiService {
	constructor(
		private readonly aiRepository: AiRepository,
		private readonly geminiService: GeminiService,
		private readonly articlesService: ArticlesService,
		private readonly aiCacheService: AiCacheService,
	) {}

	async summarizeArticle(articleId: Id, summarizeArticle: SummarizeArticle) {
		const article = await this.articlesService.findOne(articleId);
		const cacheKey = `ai/summarize/${articleId}-${summarizeArticle.maxLength}-${article.updatedAt}`;
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

		const maxLengthPrompt = getSummarizeArticleMaxLengthPrompt(summarizeArticle.maxLength);
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

	async translateArticle(articleId: Id, translateArticle: TranslateArticle) {
		const article = await this.articlesService.findOne(articleId);
		const source = translateArticle.sourceLanguage || 'auto';
		const cacheKey = `ai/translate/${articleId}-${source}-${translateArticle.targetLanguage}-${article.updatedAt}`;
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
			translateArticle.sourceLanguage,
			translateArticle.targetLanguage,
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

	async analyzeArticle(articleId: Id, analyzeArticle: AnalyzeArticle) {
		const article = await this.articlesService.findOne(articleId);

		const articleContent = generateArticlePrompt(article);

		const analyzeArticlePrompt = getAnalyzeArticlePrompt(analyzeArticle.task);
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

	async generateMessage(userId: Id, generateMessage: GenerateMessage) {
		const { message } = generateMessage;

		let chatSession = this.aiRepository.getByUserId(userId);
		if (!chatSession) chatSession = this.aiRepository.createByUser(userId);

		const { messages } = this.aiRepository.addMessageByUserId(userId, {
			role: 'user',
			parts: [{ text: message }],
		});

		const content: SendMessage = {
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

	private async sendGeminiMessage(content: SendMessage) {
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
