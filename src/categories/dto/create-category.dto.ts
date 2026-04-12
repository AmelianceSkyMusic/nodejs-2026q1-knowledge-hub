import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CreateCategoryRequestSchema } from 'shared/categories/schemas/create-category.schema';

import { CATEGORY_SWAGGER } from './categories.swagger';

export class CreateCategoryDto extends createZodDto(CreateCategoryRequestSchema) {
	@ApiProperty(CATEGORY_SWAGGER.NAME)
	name: any;

	@ApiProperty(CATEGORY_SWAGGER.DESCRIPTION)
	description: any;
}
