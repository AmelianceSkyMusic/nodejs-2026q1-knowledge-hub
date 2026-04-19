import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { Comment, CommentSchema } from 'shared/comments/schemas/comment.schema';

import { COMMENT_SWAGGER } from './comment.swagger';

export class CommentDto extends createZodDto(CommentSchema) {
	@ApiProperty(COMMENT_SWAGGER.ID)
	id: Comment['id'];

	@ApiProperty(COMMENT_SWAGGER.CONTENT)
	content: Comment['content'];

	@ApiProperty(COMMENT_SWAGGER.ARTICLE_ID)
	articleId: Comment['articleId'];

	@ApiProperty(COMMENT_SWAGGER.AUTHOR_ID)
	authorId: Comment['authorId'];

	@ApiProperty(COMMENT_SWAGGER.CREATED_AT)
	createdAt: Comment['createdAt'];
}
