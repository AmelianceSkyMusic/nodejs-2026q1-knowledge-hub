import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ArticlesWithPaginationSchema } from 'shared/articles/schemas/articles-with-pagination.schema';

import { ARTICLE_SWAGGER } from './article.swagger';

export class ArticlesWithPaginationDto extends createZodDto(ArticlesWithPaginationSchema) {
	@ApiProperty(ARTICLE_SWAGGER.TOTAL)
	total: any;

	@ApiProperty(ARTICLE_SWAGGER.PAGE)
	page: any;

	@ApiProperty(ARTICLE_SWAGGER.LIMIT)
	limit: any;

	@ApiProperty(ARTICLE_SWAGGER.DATA)
	data: any;
}
