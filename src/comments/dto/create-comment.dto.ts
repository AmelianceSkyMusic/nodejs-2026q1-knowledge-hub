import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CreateComment, CreateCommentSchema } from 'shared/comments/schemas/create-comment.schema';

import { COMMENT_SWAGGER } from './comment.swagger';

export class CreateCommentDto extends createZodDto(CreateCommentSchema) {
	@ApiProperty(COMMENT_SWAGGER.CONTENT)
	content: CreateComment['content'];

	@ApiProperty(COMMENT_SWAGGER.ARTICLE_ID)
	articleId: CreateComment['articleId'];

	@ApiProperty(COMMENT_SWAGGER.AUTHOR_ID)
	authorId: CreateComment['authorId'];
}
