import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { CommentResponseDto } from './comment.response.dto';

@Exclude()
export class CommentsWithPaginationResponseDto {
	@Expose()
	@ApiProperty({ example: 10 })
	total: number;

	@Expose()
	@ApiProperty({ example: 1 })
	page: number;

	@Expose()
	@ApiProperty({ example: 10 })
	limit: number;

	@Expose()
	@ApiProperty({ type: [CommentResponseDto] })
	data: CommentResponseDto[];
}
