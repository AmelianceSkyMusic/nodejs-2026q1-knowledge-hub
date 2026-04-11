import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CategorySchema } from 'src/_shared/categories/schemas/category.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class CategoryDto extends createZodDto(CategorySchema) {
	@ApiProperty(CATEGORY_SWAGGER.ID)
	id: any;

	@ApiProperty(CATEGORY_SWAGGER.NAME)
	name: any;

	@ApiProperty(CATEGORY_SWAGGER.DESCRIPTION)
	description: any;
}
