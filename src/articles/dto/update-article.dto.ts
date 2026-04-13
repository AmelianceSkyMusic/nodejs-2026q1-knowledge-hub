import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UpdateArticleSchema } from 'shared/articles/schemas/update-article.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class UpdateArticleDto extends createZodDto(UpdateArticleSchema) {
	@ApiProperty(ARTICLE_SWAGGER.TITLE)
	title: any;

	@ApiProperty(ARTICLE_SWAGGER.CONTENT)
	content: any;

	@ApiProperty(ARTICLE_SWAGGER.STATUS)
	status: any;

	@ApiProperty(ARTICLE_SWAGGER.CATEGORY_ID)
	categoryId: any;

	@ApiProperty(ARTICLE_SWAGGER.TAGS)
	tags: any;
}
