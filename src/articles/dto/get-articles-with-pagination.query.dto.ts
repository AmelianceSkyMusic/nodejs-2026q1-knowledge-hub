import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	GetArticlesWithPaginationQuery,
	GetArticlesWithPaginationQuerySchema,
} from 'shared/articles/schemas/get-articles-with-pagination.query.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class GetArticlesWithPaginationQueryDto extends createZodDto(
	GetArticlesWithPaginationQuerySchema,
) {
	@ApiProperty(ARTICLE_SWAGGER.QUERY.STATUS)
	status: GetArticlesWithPaginationQuery['status'];

	@ApiProperty(ARTICLE_SWAGGER.QUERY.CATEGORY_ID)
	categoryId: GetArticlesWithPaginationQuery['categoryId'];

	@ApiProperty(ARTICLE_SWAGGER.QUERY.TAG)
	tag: GetArticlesWithPaginationQuery['tag'];

	@ApiProperty(ARTICLE_SWAGGER.QUERY.PAGE)
	page: GetArticlesWithPaginationQuery['page'];

	@ApiProperty(ARTICLE_SWAGGER.QUERY.LIMIT)
	limit: GetArticlesWithPaginationQuery['limit'];

	@ApiProperty(ARTICLE_SWAGGER.QUERY.SORT_BY)
	sortBy: GetArticlesWithPaginationQuery['sortBy'];

	@ApiProperty(ARTICLE_SWAGGER.QUERY.ORDER)
	order: GetArticlesWithPaginationQuery['order'];
}
