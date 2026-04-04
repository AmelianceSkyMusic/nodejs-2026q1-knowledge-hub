import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { SWAGGER } from 'src/common/constants/swagger';

import type { Id } from 'src/common/types/id';

export class CommentResponseDto {
	@ApiProperty({
		example: SWAGGER.EXAMPLE.ID,
	})
	@Expose()
	id: Id;

	@ApiProperty({
		example: 'Great article!',
	})
	@Expose()
	content: string;

	@ApiProperty({
		example: SWAGGER.EXAMPLE.ID,
	})
	@Expose()
	articleId: Id;

	@ApiProperty({
		example: SWAGGER.EXAMPLE.ID,
	})
	@Expose()
	authorId: Id | null;

	@ApiProperty({
		example: SWAGGER.EXAMPLE.TIMESTAMP,
	})
	@Expose()
	@Type(() => Number)
	createdAt: number;
}
