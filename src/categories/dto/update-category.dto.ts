import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UpdateCategoryRequestSchema } from 'shared/categories/schemas/update-category.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class UpdateCategoryDto extends createZodDto(UpdateCategoryRequestSchema) {
	@ApiProperty(CATEGORY_SWAGGER.NAME)
	name: any;

	@ApiProperty(CATEGORY_SWAGGER.DESCRIPTION)
	description: any;
}
