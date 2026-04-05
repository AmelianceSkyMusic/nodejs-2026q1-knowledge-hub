import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { CategoryResponseDto } from './category.response.dto';

@Exclude()
export class CategoriesWithPaginationResponseDto {
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
	@ApiProperty({ type: [CategoryResponseDto] })
	data: CategoryResponseDto[];
}
