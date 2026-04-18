import type { BuildQueryResult } from 'drizzle-orm';
import type { Relations } from 'src/drizzle/db/relations';

export type UserRaw = BuildQueryResult<Relations, Relations['users'], true>;

export const mapUser = (raw: UserRaw | null | undefined) => {
	if (!raw) return null;
	return {
		id: raw.id,
		login: raw.login,
		role: raw.role,
		createdAt: raw.createdAt.getTime(),
		updatedAt: raw.updatedAt.getTime(),
	};
};
