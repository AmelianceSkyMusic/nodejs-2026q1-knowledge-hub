import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { SearchRag, SearchRagSchema } from 'shared/ai/rag/schemas/search-rag.schema';

import { RAG_SWAGGER } from './rag.swagger';

export class SearchRagDto extends createZodDto(SearchRagSchema) {
	@ApiProperty(RAG_SWAGGER.QUERY)
	query: SearchRag['query'];

	@ApiProperty(RAG_SWAGGER.LIMIT)
	limit?: SearchRag['limit'];

	@ApiProperty(RAG_SWAGGER.ARTICLE_STATUS)
	articleStatus?: SearchRag['articleStatus'];

	@ApiProperty(RAG_SWAGGER.CATEGORY_ID)
	categoryId?: SearchRag['categoryId'];

	@ApiProperty(RAG_SWAGGER.TAGS)
	tags?: SearchRag['tags'];
}
