import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	CreateCategory,
	CreateCategorySchema,
} from 'shared/categories/schemas/create-category.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {
	@ApiProperty(CATEGORY_SWAGGER.NAME)
	name: CreateCategory['name'];

	@ApiProperty(CATEGORY_SWAGGER.DESCRIPTION)
	description: CreateCategory['description'];
}
