import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import { Id } from 'shared/common/schemas/id.schema';
import { ServiceUnavailableError } from 'src/common/errors/service-unavailable.error';
import { InjectQdrant } from 'src/qdrant/decorators/qdrant.decorator';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class RagRepository implements OnModuleInit {
	private readonly logger = new Logger(RagRepository.name);
	private readonly collectionName: string;

	constructor(
		private readonly configService: ConfigService,
		@InjectQdrant() private readonly qdrantClient: QdrantClient,
	) {
		this.collectionName = this.configService.get('rag.collection');
	}

	async onModuleInit() {
		await this.ensureCollection();
	}

	private async ensureCollection() {
		try {
			const response = await this.qdrantClient.getCollections();
			const exists = response.collections.some(
				(collection) => collection.name === this.collectionName,
			);

			if (exists) return;

			await this.qdrantClient.createCollection(this.collectionName, {
				vectors: {
					size: this.configService.get<number>('rag.dimensions'),
					distance: 'Cosine',
				},
			});
			this.logger.log(`Collection "${this.collectionName}" created successfully`);
		} catch (error) {
			this.logger.error(`Failed to ensure Qdrant collection: ${error.message}`);
			throw new ServiceUnavailableError(ERROR.RAG.VECTOR_DB_UNAVAILABLE);
		}
	}

	async upsertPoints(
		points: { id: string; vector: number[]; payload: Record<string, unknown> }[],
	) {
		try {
			return await this.qdrantClient.upsert(this.collectionName, {
				wait: true,
				points,
			});
		} catch (error) {
			this.logger.error(`Qdrant upsert failed: ${error.message}`);
			throw new ServiceUnavailableError(ERROR.RAG.VECTOR_DB_UNAVAILABLE);
		}
	}

	async search(
		vector: number[],
		limit: number,
		filter: { articleStatus?: string; category?: string; tags?: string[] },
	) {
		const must = [];
		if (filter.articleStatus) {
			must.push({ key: 'metadata.articleStatus', match: { value: filter.articleStatus } });
		}
		if (filter.category) {
			must.push({ key: 'metadata.category', match: { value: filter.category } });
		}
		if (filter.tags && filter.tags.length > 0) {
			must.push({ key: 'metadata.tags', match: { any: filter.tags } });
		}

		const searchParams = {
			vector,
			limit,
			with_payload: true,
			...(must.length > 0 ? { filter: { must } } : {}),
		};

		try {
			return await this.qdrantClient.search(this.collectionName, searchParams);
		} catch (error) {
			this.logger.error(`Qdrant search failed: ${error.message}`);
			throw new ServiceUnavailableError(ERROR.RAG.VECTOR_DB_UNAVAILABLE);
		}
	}

	async countPointsByArticleId(articleId: Id): Promise<number> {
		try {
			const response = await this.qdrantClient.count(this.collectionName, {
				filter: {
					must: [
						{
							key: 'metadata.articleId',
							match: { value: articleId },
						},
					],
				},
				exact: true,
			});
			return response.count;
		} catch (error) {
			this.logger.error(`Qdrant count failed: ${error.message}`);
			throw new ServiceUnavailableError(ERROR.RAG.VECTOR_DB_UNAVAILABLE);
		}
	}

	async deleteByArticleId(articleId: Id) {
		try {
			return await this.qdrantClient.delete(this.collectionName, {
				filter: {
					must: [
						{
							key: 'metadata.articleId',
							match: { value: articleId },
						},
					],
				},
			});
		} catch (error) {
			this.logger.error(`Qdrant delete failed: ${error.message}`);
			throw new ServiceUnavailableError(ERROR.RAG.VECTOR_DB_UNAVAILABLE);
		}
	}

	getCollectionName() {
		return this.collectionName;
	}
}
