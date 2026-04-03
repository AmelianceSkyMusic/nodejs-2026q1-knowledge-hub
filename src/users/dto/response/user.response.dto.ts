import { Exclude, Expose } from 'class-transformer';
import { Id } from 'src/common/types/id';

import { UserRole } from '../../types/user-role';

@Exclude()
export class UserResponseDto {
	@Expose()
	id: Id;

	@Expose()
	login: string;

	@Expose()
	role: UserRole;

	@Expose()
	createdAt: number;

	@Expose()
	updatedAt: number;
}
