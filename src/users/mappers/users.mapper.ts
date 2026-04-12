import type { User } from 'shared/users/schemas/user.schema';
import type { Prisma } from 'src/generated/prisma/client';

export const mapUser = (raw: Prisma.UserGetPayload<object>) => ({
	id: raw.id,
	login: raw.login,
	role: raw.role.toLowerCase() as User['role'],
	createdAt: raw.createdAt.getTime(),
	updatedAt: raw.updatedAt.getTime(),
});
