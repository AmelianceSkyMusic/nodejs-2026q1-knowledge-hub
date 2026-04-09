import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CreateArticleSchema } from 'src/_shared/articles/schemas/create-article.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class CreateArticleDto extends createZodDto(CreateArticleSchema) {
	@ApiProperty(ARTICLE_SWAGGER.TITLE)
	title: any;

	@ApiProperty(ARTICLE_SWAGGER.CONTENT)
	content: any;

	@ApiProperty(ARTICLE_SWAGGER.STATUS)
	status: any;

	@ApiProperty(ARTICLE_SWAGGER.AUTHOR_ID)
	authorId: any;

	@ApiProperty(ARTICLE_SWAGGER.CATEGORY_ID)
	categoryId: any;

	@ApiProperty(ARTICLE_SWAGGER.TAGS)
	tags: any;
}
