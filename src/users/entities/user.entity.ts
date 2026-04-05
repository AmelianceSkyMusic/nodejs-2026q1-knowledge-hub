import type { Id } from 'src/common/types/id';

import type { UserRole } from '../types/user-role';

export class UserEntity {
	id: Id;
	login: string;
	password: string;
	role: UserRole;
	createdAt: number;
	updatedAt: number;
}
