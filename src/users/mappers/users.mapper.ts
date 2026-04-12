import type { Prisma } from 'generated/prisma/client';
import type { User } from 'src/_shared/users/schemas/user.schema';

export const mapUser = (raw: Prisma.UserGetPayload<object>) => ({
	id: raw.id,
	login: raw.login,
	role: raw.role.toLowerCase() as User['role'],
	createdAt: raw.createdAt.getTime(),
	updatedAt: raw.updatedAt.getTime(),
});
