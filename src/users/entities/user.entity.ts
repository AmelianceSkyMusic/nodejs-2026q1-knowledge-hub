import type { Id } from 'src/_shared/common/schemas/id.schema';
import type { UserRole } from 'src/_shared/users/types/user-role';

export class UserEntity {
	id: Id;
	login: string;
	password: string;
	role: UserRole;
	createdAt: number;
	updatedAt: number;
}
