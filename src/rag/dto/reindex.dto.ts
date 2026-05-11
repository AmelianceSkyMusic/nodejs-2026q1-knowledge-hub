import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ReindexSchema } from 'shared/rag/schemas/reindex.schema';

import { RAG_SWAGGER } from './rag.swagger';

import type { Reindex } from 'shared/rag/schemas/reindex.schema';

export class ReindexDto extends createZodDto(ReindexSchema) {
	@ApiProperty({
		...RAG_SWAGGER.ONLY_PUBLISHED,
		required: false,
	})
	onlyPublished: Reindex['onlyPublished'];

	@ApiProperty(RAG_SWAGGER.ARTICLE_IDS)
	articleIds?: Reindex['articleIds'];
}
