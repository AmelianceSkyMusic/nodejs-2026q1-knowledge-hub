import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	ArticlesWithPagination,
	ArticlesWithPaginationSchema,
} from 'shared/articles/schemas/articles-with-pagination.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class ArticlesWithPaginationDto extends createZodDto(ArticlesWithPaginationSchema) {
	@ApiProperty(ARTICLE_SWAGGER.TOTAL)
	total: ArticlesWithPagination['total'];

	@ApiProperty(ARTICLE_SWAGGER.PAGE)
	page: ArticlesWithPagination['page'];

	@ApiProperty(ARTICLE_SWAGGER.LIMIT)
	limit: ArticlesWithPagination['limit'];

	@ApiProperty(ARTICLE_SWAGGER.DATA)
	data: ArticlesWithPagination['data'];
}
