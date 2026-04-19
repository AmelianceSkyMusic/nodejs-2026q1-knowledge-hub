import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	GetCategoriesWithPaginationQuery,
	GetCategoriesWithPaginationQuerySchema,
} from 'shared/categories/schemas/get-categories-with-pagination-query.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class GetCategoriesWithPaginationQueryDto extends createZodDto(
	GetCategoriesWithPaginationQuerySchema,
) {
	@ApiProperty(CATEGORY_SWAGGER.QUERY.PAGE)
	page: GetCategoriesWithPaginationQuery['page'];

	@ApiProperty(CATEGORY_SWAGGER.QUERY.LIMIT)
	limit: GetCategoriesWithPaginationQuery['limit'];

	@ApiProperty(CATEGORY_SWAGGER.QUERY.SORT_BY)
	sortBy: GetCategoriesWithPaginationQuery['sortBy'];

	@ApiProperty(CATEGORY_SWAGGER.QUERY.ORDER)
	order: GetCategoriesWithPaginationQuery['order'];
}
