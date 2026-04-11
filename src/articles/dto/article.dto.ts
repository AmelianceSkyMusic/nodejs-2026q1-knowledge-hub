import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ArticleSchema } from 'src/_shared/articles/schemas/article.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class ArticleDto extends createZodDto(ArticleSchema) {
	@ApiProperty(ARTICLE_SWAGGER.ID)
	id: any;

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

	@ApiProperty(ARTICLE_SWAGGER.CREATED_AT)
	createdAt: any;

	@ApiProperty(ARTICLE_SWAGGER.UPDATED_AT)
	updatedAt: any;
}
