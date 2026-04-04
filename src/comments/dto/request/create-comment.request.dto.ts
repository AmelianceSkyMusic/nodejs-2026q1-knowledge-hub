import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Id } from 'src/common/types/id';

import { SWAGGER } from 'src/common/constants/swagger';

export class CreateCommentRequestDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	content: string;

	@ApiProperty({ example: SWAGGER.EXAMPLE.ID })
	@IsNotEmpty()
	@IsUUID('4')
	articleId: Id;

	@ApiProperty({
		example: SWAGGER.EXAMPLE.ID,
	})
	@IsOptional()
	@IsUUID('4')
	authorId?: Id | null = null;
}
