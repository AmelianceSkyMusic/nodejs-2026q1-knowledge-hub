import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ArticleSortBy } from 'src/articles/types/article-sort-by';
import { Order } from 'src/common/types/order';

import { GetArticlesQueryRequestDto } from './get-articles-query.request.dto';

import { ARTICLE_SORT_BY } from 'src/articles/constants/article-sort-by';
import { ORDER } from 'src/common/constants/order';

export class GetArticlesWithPaginationQueryRequestDto extends GetArticlesQueryRequestDto {
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
		enum: ARTICLE_SORT_BY,
		required: false,
		default: ARTICLE_SORT_BY.CREATED_AT,
	})
	@IsOptional()
	@IsEnum(ARTICLE_SORT_BY)
	sortBy?: ArticleSortBy = ARTICLE_SORT_BY.CREATED_AT;

	@ApiProperty({
		description: 'Order',
		enum: ORDER,
		required: false,
		default: ORDER.DESC,
	})
	@IsOptional()
	@IsEnum(ORDER)
	order?: Order = ORDER.DESC;
}
