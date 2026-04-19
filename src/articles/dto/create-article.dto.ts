import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CreateArticle, CreateArticleSchema } from 'shared/articles/schemas/create-article.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class CreateArticleDto extends createZodDto(CreateArticleSchema) {
	@ApiProperty(ARTICLE_SWAGGER.TITLE)
	title: CreateArticle['title'];

	@ApiProperty(ARTICLE_SWAGGER.CONTENT)
	content: CreateArticle['content'];

	@ApiProperty(ARTICLE_SWAGGER.STATUS)
	status: CreateArticle['status'];

	@ApiProperty(ARTICLE_SWAGGER.AUTHOR_ID)
	authorId: CreateArticle['authorId'];

	@ApiProperty(ARTICLE_SWAGGER.CATEGORY_ID)
	categoryId: CreateArticle['categoryId'];

	@ApiProperty(ARTICLE_SWAGGER.TAGS)
	tags: CreateArticle['tags'];
}
