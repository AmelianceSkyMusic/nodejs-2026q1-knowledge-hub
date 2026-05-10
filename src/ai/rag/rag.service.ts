import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReindexStats } from 'shared/ai/rag/schemas/reindex-stats.schema';
import { Reindex } from 'shared/ai/rag/schemas/reindex.schema';
import { ArticleWithRelations } from 'shared/articles/schemas/article-with-relations.schema';
import { GeminiService } from 'src/ai/gemini/gemini.service';
import { ArticlesService } from 'src/articles/articles.service';
import { v4 as uuidV4 } from 'uuid';

import { RagRepository } from './repositories/rag.repository';

import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';

@Injectable()
export class RagService implements OnModuleInit {
	constructor(
		private readonly configService: ConfigService,
		private readonly articlesService: ArticlesService,
		private readonly geminiService: GeminiService,
		private readonly ragRepository: RagRepository,
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

	private splitArticleToChunks(articles: ArticleWithRelations[]) {
		const { chunkSize, chunkOverlap } = this.configService.get('rag');
		return articles.flatMap((article) => {
			const chunkedTexts = this.splitToChunks(article.content, chunkSize, chunkOverlap);

			return chunkedTexts.map((chunkText) => ({
				text: chunkText,
				metadata: {
					articleId: article.id,
					title: article.title,
					category: article.category?.name,
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
