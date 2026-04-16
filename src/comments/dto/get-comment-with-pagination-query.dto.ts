import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	GetCommentsWithPaginationQuery,
	GetCommentsWithPaginationQuerySchema,
} from 'shared/comments/schemas/get-comment-with-pagination-query.schema';

import { COMMENT_SWAGGER } from './comment.swagger';

export class GetCommentsWithPaginationQueryDto extends createZodDto(
	GetCommentsWithPaginationQuerySchema,
) {
	@ApiProperty(COMMENT_SWAGGER.ARTICLE_ID)
	articleId: GetCommentsWithPaginationQuery['articleId'];

	@ApiProperty(COMMENT_SWAGGER.QUERY.PAGE)
	page: GetCommentsWithPaginationQuery['page'];

	@ApiProperty(COMMENT_SWAGGER.QUERY.LIMIT)
	limit: GetCommentsWithPaginationQuery['limit'];

	@ApiProperty(COMMENT_SWAGGER.QUERY.SORT_BY)
	sortBy: GetCommentsWithPaginationQuery['sortBy'];

	@ApiProperty(COMMENT_SWAGGER.QUERY.ORDER)
	order: GetCommentsWithPaginationQuery['order'];
}
