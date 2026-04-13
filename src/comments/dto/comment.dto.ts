import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CommentSchema } from 'shared/comments/schemas/comment.schema';

import { COMMENT_SWAGGER } from './comment.swagger';

export class CommentDto extends createZodDto(CommentSchema) {
	@ApiProperty(COMMENT_SWAGGER.ID)
	id: any;

	@ApiProperty(COMMENT_SWAGGER.CONTENT)
	content: any;

	@ApiProperty(COMMENT_SWAGGER.ARTICLE_ID)
	articleId: any;

	@ApiProperty(COMMENT_SWAGGER.AUTHOR_ID)
	authorId: any;

	@ApiProperty(COMMENT_SWAGGER.CREATED_AT)
	createdAt: any;
}
