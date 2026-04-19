import type { Id } from 'shared/common/schemas/id.schema';
import type { UserRole } from 'shared/users/types/user-role';

export type JwtPayload = {
	userId: Id;
	login: string;
	role: UserRole;
};
