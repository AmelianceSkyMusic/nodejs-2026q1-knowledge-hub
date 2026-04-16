import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	UpdateCategory,
	UpdateCategorySchema,
} from 'shared/categories/schemas/update-category.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {
	@ApiProperty(CATEGORY_SWAGGER.NAME)
	name: UpdateCategory['name'];

	@ApiProperty(CATEGORY_SWAGGER.DESCRIPTION)
	description: UpdateCategory['description'];
}
