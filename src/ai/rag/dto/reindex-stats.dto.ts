import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ReindexStatsSchema } from 'shared/ai/rag/schemas/reindex-stats.schema';

import { RAG_SWAGGER } from './rag.swagger';

import type { ReindexStats } from 'shared/ai/rag/schemas/reindex-stats.schema';

export class ReindexStatsDto extends createZodDto(ReindexStatsSchema) {
	@ApiProperty(RAG_SWAGGER.INDEXED_ARTICLES)
	indexedArticles: ReindexStats['indexedArticles'];

	@ApiProperty(RAG_SWAGGER.INDEXED_CHUNKS)
	indexedChunks: ReindexStats['indexedChunks'];

	@ApiProperty(RAG_SWAGGER.VECTOR_COLLECTION)
	vectorCollection: ReindexStats['vectorCollection'];
}
