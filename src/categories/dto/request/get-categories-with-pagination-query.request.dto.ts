import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CategorySortBy } from 'src/categories/types/category-sort-by';
import { Order } from 'src/common/types/order';

import { CATEGORY_SORT_BY } from 'src/categories/constants/category-sort-by';
import { ORDER } from 'src/common/constants/order';

export class GetCategoriesWithPaginationQueryRequestDto {
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
		enum: CATEGORY_SORT_BY,
		required: false,
		default: CATEGORY_SORT_BY.NAME,
	})
	@IsOptional()
	@IsEnum(CATEGORY_SORT_BY)
	sortBy?: CategorySortBy = CATEGORY_SORT_BY.NAME;

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
