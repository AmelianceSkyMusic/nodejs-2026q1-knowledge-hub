import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UpdateArticle, UpdateArticleSchema } from 'shared/articles/schemas/update-article.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class UpdateArticleDto extends createZodDto(UpdateArticleSchema) {
	@ApiProperty(ARTICLE_SWAGGER.TITLE)
	title: UpdateArticle['title'];

	@ApiProperty(ARTICLE_SWAGGER.CONTENT)
	content: UpdateArticle['content'];

	@ApiProperty(ARTICLE_SWAGGER.STATUS)
	status: UpdateArticle['status'];

	@ApiProperty(ARTICLE_SWAGGER.CATEGORY_ID)
	categoryId: UpdateArticle['categoryId'];

	@ApiProperty(ARTICLE_SWAGGER.TAGS)
	tags: UpdateArticle['tags'];
}
