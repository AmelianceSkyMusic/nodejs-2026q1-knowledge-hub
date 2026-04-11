import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CreateCommentSchema } from 'src/_shared/comments/schemas/create-comment.schema';

import { COMMENT_SWAGGER } from './comment.swagger';

export class CreateCommentDto extends createZodDto(CreateCommentSchema) {
	@ApiProperty(COMMENT_SWAGGER.CONTENT)
	content: any;

	@ApiProperty(COMMENT_SWAGGER.ARTICLE_ID)
	articleId: any;

	@ApiProperty(COMMENT_SWAGGER.AUTHOR_ID)
	authorId: any;
}
