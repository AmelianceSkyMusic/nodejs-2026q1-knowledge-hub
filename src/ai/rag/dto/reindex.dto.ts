import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { Reindex, ReindexSchema } from 'shared/ai/rag/schemas/reindex.schema';

import { RAG_SWAGGER } from './rag.swagger';

export class ReindexDto extends createZodDto(ReindexSchema) {
	@ApiProperty(RAG_SWAGGER.ONLY_PUBLISHED)
	onlyPublished: Reindex['onlyPublished'];

	@ApiProperty(RAG_SWAGGER.ARTICLE_IDS)
	articleIds: Reindex['articleIds'];
}
