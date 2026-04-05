import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Order } from 'src/common/types/order';
import { UserSortBy } from 'src/users/types/user-sort-by';

import { ORDER } from 'src/common/constants/order';
import { USER_SORT_BY } from 'src/users/constants/user-sort-by';

export class GetUsersWithPaginationQueryRequestDto {
	@ApiProperty({
		description: 'Page number',
		required: false,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	page?: number;

	@ApiProperty({
		description: 'Limit',
		required: false,
		default: 10,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	limit?: number = 10;

	@ApiProperty({
		description: 'Sort by',
		enum: USER_SORT_BY,
		required: false,
		default: USER_SORT_BY.LOGIN,
	})
	@IsOptional()
	@IsEnum(USER_SORT_BY)
	sortBy?: UserSortBy = USER_SORT_BY.LOGIN;

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
