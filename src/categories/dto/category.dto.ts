import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { Category, CategorySchema } from 'shared/categories/schemas/category.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class CategoryDto extends createZodDto(CategorySchema) {
	@ApiProperty(CATEGORY_SWAGGER.ID)
	id: Category['id'];

	@ApiProperty(CATEGORY_SWAGGER.NAME)
	name: Category['name'];

	@ApiProperty(CATEGORY_SWAGGER.DESCRIPTION)
	description: Category['description'];
}
