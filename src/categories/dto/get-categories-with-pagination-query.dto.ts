import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { GetCategoriesWithPaginationQuerySchema } from 'shared/categories/schemas/get-categories-with-pagination-query.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class GetCategoriesWithPaginationQueryDto extends createZodDto(
	GetCategoriesWithPaginationQuerySchema,
) {
	@ApiProperty(CATEGORY_SWAGGER.QUERY.PAGE)
	page: any;

	@ApiProperty(CATEGORY_SWAGGER.QUERY.LIMIT)
	limit: any;

	@ApiProperty(CATEGORY_SWAGGER.QUERY.SORT_BY)
	sortBy: any;

	@ApiProperty(CATEGORY_SWAGGER.QUERY.ORDER)
	order: any;
}
