import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CommentSortBy } from 'src/comments/types/comment-sort-by';
import { Order } from 'src/common/types/order';

import { GetCommentsQueryRequestDto } from './get-comment-query.request.dto';

import { COMMENT_SORT_BY } from 'src/comments/constants/comment-sort-by';
import { ORDER } from 'src/common/constants/order';

export class GetCommentsWithPaginationQueryRequestDto extends GetCommentsQueryRequestDto {
	@ApiProperty({
		description: 'Page number',
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	page?: number;

	@ApiProperty({
		description: 'Limit',
		required: false,
		default: 10,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	limit?: number = 10;

	@ApiProperty({
		description: 'Sort by',
		enum: COMMENT_SORT_BY,
		required: false,
		default: COMMENT_SORT_BY.CREATED_AT,
	})
	@IsOptional()
	@IsEnum(COMMENT_SORT_BY)
	sortBy?: CommentSortBy = COMMENT_SORT_BY.CREATED_AT;

	@ApiProperty({
		description: 'Order',
		enum: ORDER,
		required: false,
		default: ORDER.ASC,
	})
	@IsOptional()
	@IsEnum(ORDER)
	order?: Order = ORDER.ASC;
}
