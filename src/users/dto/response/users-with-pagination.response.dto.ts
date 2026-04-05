import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { UserResponseDto } from './user.response.dto';

@Exclude()
export class UsersWithPaginationResponseDto {
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
	@ApiProperty({ type: [UserResponseDto] })
	data: UserResponseDto[];
}
