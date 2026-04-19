import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	CategoriesWithPagination,
	CategoriesWithPaginationSchema,
} from 'shared/categories/schemas/categories-with-pagination.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class CategoriesWithPaginationDto extends createZodDto(CategoriesWithPaginationSchema) {
	@ApiProperty(CATEGORY_SWAGGER.TOTAL)
	total: CategoriesWithPagination['total'];

	@ApiProperty(CATEGORY_SWAGGER.PAGE)
	page: CategoriesWithPagination['page'];

	@ApiProperty(CATEGORY_SWAGGER.LIMIT)
	limit: CategoriesWithPagination['limit'];

	@ApiProperty(CATEGORY_SWAGGER.DATA)
	data: CategoriesWithPagination['data'];
}
