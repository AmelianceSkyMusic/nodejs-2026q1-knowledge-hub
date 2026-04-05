import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Id } from 'src/common/types/id';

import { UserRole } from '../../types/user-role';

import { SWAGGER } from 'src/common/constants/swagger';

@Exclude()
export class UserResponseDto {
	@ApiProperty({
		example: SWAGGER.EXAMPLE.ID,
	})
	@Expose()
	id: Id;

	@ApiProperty({
		example: 'TestUser',
	})
	@Expose()
	login: string;

	@ApiProperty({
		example: 'viewer',
	})
	@Expose()
	role: UserRole;

	@ApiProperty({
		example: SWAGGER.EXAMPLE.TIMESTAMP,
	})
	@Expose()
	createdAt: number;

	@ApiProperty({
		example: SWAGGER.EXAMPLE.TIMESTAMP,
	})
	@Expose()
	updatedAt: number;
}
