import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CommentsWithPaginationSchema } from 'shared/comments/schemas/comments-with-pagination.schema';

import { COMMENT_SWAGGER } from './comment.swagger';

export class CommentsWithPaginationDto extends createZodDto(CommentsWithPaginationSchema) {
	@ApiProperty(COMMENT_SWAGGER.TOTAL)
	total: any;

	@ApiProperty(COMMENT_SWAGGER.PAGE)
	page: any;

	@ApiProperty(COMMENT_SWAGGER.LIMIT)
	limit: any;

	@ApiProperty(COMMENT_SWAGGER.DATA)
	data: any;
}
