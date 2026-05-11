import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatRag } from 'shared/ai/rag/schemas/chat-rag.schema';
import { RagChat } from 'shared/ai/rag/schemas/rag-chat.schema';
import { RagSearch } from 'shared/ai/rag/schemas/rag-search.schema';
import { ReindexStats } from 'shared/ai/rag/schemas/reindex-stats.schema';
import { Reindex } from 'shared/ai/rag/schemas/reindex.schema';
import { SearchRag } from 'shared/ai/rag/schemas/search-rag.schema';
import { ArticleWithRelations } from 'shared/articles/schemas/article-with-relations.schema';
import { GeminiService, SendMessage } from 'src/ai/gemini/gemini.service';
import { ArticlesService } from 'src/articles/articles.service';
import { CategoriesService } from 'src/categories/categories.service';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { v4 as uuidV4 } from 'uuid';

import { getSystemInstruction } from './prompts/get-system-instruction.prompt';
import { RagChatRepository } from './repositories/rag-chat.repository';
import { RagRepository } from './repositories/rag.repository';
import { RagPayloadSchema } from './schemas/rag-payload.schema';

import { GEMINI_CONFIGS } from '../constants/gemini-configs';
import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';
import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class RagService implements OnModuleInit {
	constructor(
		private readonly configService: ConfigService,
		private readonly articlesService: ArticlesService,
		private readonly categoryService: CategoriesService,
		private readonly geminiService: GeminiService,
		private readonly ragRepository: RagRepository,
		private readonly ragChatRepository: RagChatRepository,
	) {}

	async onModuleInit() {}

	async index(reindex: Reindex): Promise<ReindexStats> {
		const status = reindex?.onlyPublished ? { status: ARTICLE_STATUS.PUBLISHED } : {};
		const articles = await this.articlesService.findManyWithRelations({
			ids: reindex.articleIds,
			...status,
		});

		for (const article of articles) {
			await this.ragRepository.deleteByArticleId(article.id);
		}

		const articleChunksWithMetadata = this.splitArticleToChunks(articles);

		const embeddings = await this.geminiService.getEmbedding(
			articleChunksWithMetadata.map((item) => item.text),
		);

		const points = articleChunksWithMetadata.map((articleChunk, index) => {
			return {
				id: uuidV4(),
				vector: embeddings[index],
				payload: articleChunk,
			};
		});

		await this.ragRepository.upsertPoints(points);

		return {
			indexedArticles: articles.length,
			indexedChunks: points.length,
			vectorCollection: this.ragRepository.getCollectionName(),
		};
	}

	async search(searchRag: SearchRag): Promise<RagSearch> {
		const category = searchRag.categoryId
			? await this.categoryService.findOne(searchRag.categoryId)
			: null;

		const embedding = await this.geminiService.getEmbedding([searchRag.query]);

		const result = await this.ragRepository.search(embedding[0], searchRag.limit, {
			articleStatus: searchRag.articleStatus,
			category: category?.name,
			tags: searchRag.tags,
		});

		return {
			results: result.map((point) => {
				const payload = RagPayloadSchema.parse(point.payload);
				return {
					articleId: payload.metadata.articleId,
					articleTitle: payload.metadata.title,
					chunk: payload.text,
					similarity: point.score,
				};
			}),
		};
	}

	async chat(chatRag: ChatRag): Promise<RagChat> {
		const embedding = await this.geminiService.getEmbedding([chatRag.question]);
		const result = await this.ragRepository.search(embedding[0], 5, {
			articleStatus: ARTICLE_STATUS.PUBLISHED,
		});
		const context = result.map((point) => RagPayloadSchema.parse(point.payload));

		const conversationId = chatRag.conversationId || uuidV4();

		const { messages } = this.ragChatRepository.addMessageByConversationId(conversationId, {
			parts: [{ text: chatRag.question }],
		});

		const systemInstruction = getSystemInstruction(context.map((c) => c.text).join('\n\n'));

		const content: SendMessage = {
			contents: messages,
			config: {
				...GEMINI_CONFIGS.CHAT,
				systemInstruction: {
					parts: [{ text: systemInstruction }],
				},
			},
		};

		const response = await this.geminiService.sendMessage(content);
		const answer = response.text;

		this.ragChatRepository.addMessageByConversationId(conversationId, {
			role: 'model',
			parts: [{ text: answer }],
		});

		return {
			conversationId,
			sources: context.map((payload) => {
				return {
					articleId: payload.metadata.articleId,
					articleTitle: payload.metadata.title,
					relevantChunk: payload.text,
				};
			}),
			answer,
		};
	}

	async remove(articleId: string) {
		const count = await this.ragRepository.countPointsByArticleId(articleId);
		if (count === 0) throw new NotFoundError(ERROR.RAG.ARTICLE_NOT_FOUND);
		return await this.ragRepository.deleteByArticleId(articleId);
	}

	async getChatHistory(conversationId: string) {
		const history = this.ragChatRepository.getByConversationId(conversationId);
		if (!history) throw new NotFoundError(ERROR.RAG.CHAT_NOT_FOUND);
		return history;
	}

	private splitArticleToChunks(articles: ArticleWithRelations[]) {
		const { chunkSize, chunkOverlap } = this.configService.get('rag');
		return articles.flatMap((article) => {
			const chunkedTexts = this.splitToChunks(article.content, chunkSize, chunkOverlap);

			return chunkedTexts.map((chunkText) => ({
				text: chunkText,
				metadata: {
					articleId: article.id,
					title: article.title,
					category: article.category.name,
					articleStatus: article.status,
					tags: article.tags,
				},
			}));
		});
	}

	private splitToChunks(text: string, size: number, overlap: number) {
		let start = 0;
		const chunks = [];
		while (start < text.length) {
			const end = start + size >= text.length ? text.length : start + size;
			const textChunk = text.slice(start, end);
			chunks.push(textChunk);
			start = start + (size - overlap);

			if (size <= overlap) break;
		}
		return chunks;
	}
}
