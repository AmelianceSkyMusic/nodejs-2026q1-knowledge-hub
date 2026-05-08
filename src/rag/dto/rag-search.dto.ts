import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	RagSearchElement,
	RagSearchElementSchema,
	RagSearchSchema,
} from 'shared/rag/schemas/rag-search.schema';

import { RAG_SWAGGER } from './rag.swagger';

export class RagSearchElementDto extends createZodDto(RagSearchElementSchema) {
	@ApiProperty(RAG_SWAGGER.ARTICLE_ID)
	articleId: RagSearchElement['articleId'];

	@ApiProperty(RAG_SWAGGER.ARTICLE_TITLE)
	articleTitle: RagSearchElement['articleTitle'];

	@ApiProperty(RAG_SWAGGER.CHUNK)
	chunk: RagSearchElement['chunk'];

	@ApiProperty(RAG_SWAGGER.SIMILARITY)
	similarity: RagSearchElement['similarity'];
}

export class RagSearchDto extends createZodDto(RagSearchSchema) {
	@ApiProperty({ ...RAG_SWAGGER.RESULTS, type: [RagSearchElementDto] })
	results: RagSearchElementDto[];
}
