import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	CommentsWithPagination,
	CommentsWithPaginationSchema,
} from 'shared/comments/schemas/comments-with-pagination.schema';

import { COMMENT_SWAGGER } from './comment.swagger';

export class CommentsWithPaginationDto extends createZodDto(CommentsWithPaginationSchema) {
	@ApiProperty(COMMENT_SWAGGER.TOTAL)
	total: CommentsWithPagination['total'];

	@ApiProperty(COMMENT_SWAGGER.PAGE)
	page: CommentsWithPagination['page'];

	@ApiProperty(COMMENT_SWAGGER.LIMIT)
	limit: CommentsWithPagination['limit'];

	@ApiProperty(COMMENT_SWAGGER.DATA)
	data: CommentsWithPagination['data'];
}
