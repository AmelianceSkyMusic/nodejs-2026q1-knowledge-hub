import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { GetArticlesWithPaginationQuerySchema } from 'src/_shared/articles/schemas/get-articles-with-pagination.query.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class GetArticlesWithPaginationQueryDto extends createZodDto(
	GetArticlesWithPaginationQuerySchema,
) {
	@ApiProperty(ARTICLE_SWAGGER.QUERY.STATUS)
	status: any;

	@ApiProperty(ARTICLE_SWAGGER.QUERY.CATEGORY_ID)
	categoryId: any;

	@ApiProperty(ARTICLE_SWAGGER.QUERY.TAG)
	tag: any;

	@ApiProperty(ARTICLE_SWAGGER.QUERY.PAGE)
	page: any;

	@ApiProperty(ARTICLE_SWAGGER.QUERY.LIMIT)
	limit: any;

	@ApiProperty(ARTICLE_SWAGGER.QUERY.SORT_BY)
	sortBy: any;

	@ApiProperty(ARTICLE_SWAGGER.QUERY.ORDER)
	order: any;
}
