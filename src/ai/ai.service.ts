import { Injectable } from '@nestjs/common';
import { Id } from 'shared/common/schemas/id.schema';
import { ArticlesService } from 'src/articles/articles.service';
import { ServiceUnavailableError } from 'src/common/errors/service-unavailable.error';

import { AiCacheService } from './ai-cache.service';
import { AnalyzeArticleDto } from './dto/analyze-article.dto';
import { GenerateMessageDto } from './dto/generate-message.dto';
import { SummarizeArticleDto } from './dto/summarize-article.dto';
import { TranslateArticleDto } from './dto/translate-article.dto';
import { GeminiService } from './gemini.service';
import { chatPrompt } from './prompts/chat.prompt';
import { getAnalyzeArticlePrompt } from './prompts/get-analyze-article-prompt';
import { generateArticlePrompt } from './prompts/get-article.prompt';
import { getSummarizeArticleMaxLengthPrompt } from './prompts/get-summarize-article-max-length.prompt';
import { getTranslateArticlePrompt } from './prompts/get-translate-article.prompt';
import { masterPrompt } from './prompts/master.prompt';
import { AiRepository } from './repositories/ai.repository';
import { GeminiRequest } from './types/gemini/request.types';
import { generateGeminiContent } from './utils/generate-gemini-content';
import { prepareAiResponse } from './utils/prepare-ai-response';

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
		const cached = this.aiCacheService.getCache(cacheKey) as {
			articleId: Id;
			summary: string;
			originalLength: number;
			summaryLength: number;
		};
		if (cached) return cached;

		const articleContent = generateArticlePrompt(article);

		const maxLengthPrompt = getSummarizeArticleMaxLengthPrompt(summarizeArticleDto.maxLength);
		const systemInstruction = `${masterPrompt}\n${maxLengthPrompt}`;

		const { messageText, tokens } = await this.runGemini(articleContent, systemInstruction);

		this.aiRepository.updateStats('ai/summarize', tokens);

		const response = {
			articleId,
			summary: messageText,
			originalLength: article.content.length,
			summaryLength: messageText.length,
		};
		this.aiCacheService.setCache(cacheKey, response);

		return response;
	}

	async translateArticle(articleId: Id, translateArticleDto: TranslateArticleDto) {
		const article = await this.articlesService.findOne(articleId);
		const source = translateArticleDto.sourceLanguage || 'auto';
		const cacheKey = `ai/translate/${articleId}-${source}-${translateArticleDto.targetLanguage}-${article.updatedAt.getTime()}`;
		const cached = this.aiCacheService.getCache(cacheKey) as {
			articleId: Id;
			translatedText: string;
			detectedLanguage: string;
		};
		if (cached) return cached;

		const articleContent = generateArticlePrompt(article);

		const translationPrompt = getTranslateArticlePrompt(
			translateArticleDto.sourceLanguage,
			translateArticleDto.targetLanguage,
		);
		const systemInstruction = `${masterPrompt}\n${translationPrompt}`;

		const { messageText, tokens } = await this.runGemini(articleContent, systemInstruction);

		const translatedArticle = JSON.parse(prepareAiResponse(messageText));

		const isValidResponse =
			'translatedText' in translatedArticle &&
			translatedArticle.translatedText &&
			'detectedLanguage' in translatedArticle &&
			translatedArticle.detectedLanguage &&
			typeof translatedArticle.translatedText === 'string' &&
			translatedArticle.translatedText.length > 0 &&
			typeof translatedArticle.detectedLanguage === 'string' &&
			translatedArticle.detectedLanguage.length > 0;

		if (!isValidResponse) throw new ServiceUnavailableError('AI error');

		this.aiRepository.updateStats('ai/translate', tokens);

		const response = {
			articleId,
			translatedText: translatedArticle.translatedText,
			detectedLanguage: translatedArticle.detectedLanguage,
		};
		this.aiCacheService.setCache(cacheKey, response);

		return response;
	}

	async analyzeArticle(articleId: Id, analyzeArticleDto: AnalyzeArticleDto) {
		const article = await this.articlesService.findOne(articleId);

		const articleContent = generateArticlePrompt(article);

		const analyzeArticlePrompt = getAnalyzeArticlePrompt(analyzeArticleDto.task);
		const systemInstruction = `${masterPrompt}\n${analyzeArticlePrompt}`;

		const { messageText, tokens } = await this.runGemini(articleContent, systemInstruction);

		const analyzedArticle = JSON.parse(prepareAiResponse(messageText));

		const isValidResponse =
			'analysis' in analyzedArticle &&
			'suggestions' in analyzedArticle &&
			Array.isArray(analyzedArticle.suggestions) &&
			'severity' in analyzedArticle;

		if (!isValidResponse) throw new ServiceUnavailableError('AI error');

		this.aiRepository.updateStats('ai/analyze', tokens);

		return {
			articleId,
			analysis: analyzedArticle.analysis,
			suggestions: analyzedArticle.suggestions,
			severity: analyzedArticle.severity,
		};
	}

	async generateMessage(userId: Id, generateMessageDto: GenerateMessageDto) {
		const { message } = generateMessageDto;

		const chatSession = this.aiRepository.getByUserId(userId);
		if (!chatSession) this.aiRepository.createByUser(userId);

		const { messages } = this.aiRepository.addMessageByUserId(userId, {
			role: 'user',
			parts: [{ text: message }],
		});

		const content: GeminiRequest = {
			contents: messages,
			systemInstruction: {
				parts: [{ text: chatPrompt }],
			},
		};

		const { messageText, tokens } = await this.sendGeminiMessage(content);

		this.aiRepository.addMessageByUserId(userId, {
			role: 'model',
			parts: [{ text: messageText }],
		});

		this.aiRepository.updateStats('ai/generate', tokens);

		return { message: messageText };
	}

	async getStatistics() {
		return this.aiRepository.getStatistics();
	}

	private async sendGeminiMessage(content: GeminiRequest) {
		const geminiResponse = await this.geminiService.sendMessage(content);
		if ('error' in geminiResponse) throw new ServiceUnavailableError('AI error');

		const responsePart = geminiResponse?.candidates?.[0]?.content?.parts?.[0];
		const messageText = responsePart && 'text' in responsePart ? responsePart.text : '';

		const tokens = geminiResponse?.usageMetadata?.totalTokenCount;

		return { messageText, tokens };
	}

	private async runGemini(prompt: string, systemPrompt?: string) {
		const content = generateGeminiContent(prompt, systemPrompt);

		return this.sendGeminiMessage(content);
	}
}
