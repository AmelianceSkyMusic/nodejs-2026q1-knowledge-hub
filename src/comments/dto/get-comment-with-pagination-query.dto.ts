import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { GetCommentsWithPaginationQuerySchema } from 'src/_shared/comments/schemas/get-comment-with-pagination-query.schema';

import { COMMENT_SWAGGER } from './comment.swagger';

export class GetCommentsWithPaginationQueryDto extends createZodDto(
	GetCommentsWithPaginationQuerySchema,
) {
	@ApiProperty(COMMENT_SWAGGER.ARTICLE_ID)
	articleId: any;

	@ApiProperty(COMMENT_SWAGGER.QUERY.PAGE)
	page: any;

	@ApiProperty(COMMENT_SWAGGER.QUERY.LIMIT)
	limit: any;

	@ApiProperty(COMMENT_SWAGGER.QUERY.SORT_BY)
	sortBy: any;

	@ApiProperty(COMMENT_SWAGGER.QUERY.ORDER)
	order: any;
}
