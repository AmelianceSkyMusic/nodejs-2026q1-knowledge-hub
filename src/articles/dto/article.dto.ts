import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { Article, ArticleSchema } from 'shared/articles/schemas/article.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class ArticleDto extends createZodDto(ArticleSchema) {
	@ApiProperty(ARTICLE_SWAGGER.ID)
	id: Article['id'];

	@ApiProperty(ARTICLE_SWAGGER.TITLE)
	title: Article['title'];

	@ApiProperty(ARTICLE_SWAGGER.CONTENT)
	content: Article['content'];

	@ApiProperty(ARTICLE_SWAGGER.STATUS)
	status: Article['status'];

	@ApiProperty(ARTICLE_SWAGGER.AUTHOR_ID)
	authorId: Article['authorId'];

	@ApiProperty(ARTICLE_SWAGGER.CATEGORY_ID)
	categoryId: Article['categoryId'];

	@ApiProperty(ARTICLE_SWAGGER.TAGS)
	tags: Article['tags'];

	@ApiProperty(ARTICLE_SWAGGER.CREATED_AT)
	createdAt: Article['createdAt'];

	@ApiProperty(ARTICLE_SWAGGER.UPDATED_AT)
	updatedAt: Article['updatedAt'];
}
