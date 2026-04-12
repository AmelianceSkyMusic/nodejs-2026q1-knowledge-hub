import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CategoriesWithPaginationSchema } from 'shared/categories/schemas/categories-with-pagination.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class CategoriesWithPaginationDto extends createZodDto(CategoriesWithPaginationSchema) {
	@ApiProperty(CATEGORY_SWAGGER.TOTAL)
	total: any;

	@ApiProperty(CATEGORY_SWAGGER.PAGE)
	page: any;

	@ApiProperty(CATEGORY_SWAGGER.LIMIT)
	limit: any;

	@ApiProperty(CATEGORY_SWAGGER.DATA)
	data: any;
}
