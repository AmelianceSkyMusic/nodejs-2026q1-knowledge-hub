import type { BuildQueryResult } from 'drizzle-orm';
import type { Relations } from 'src/drizzle/db/relations';

export type CategoryRaw = BuildQueryResult<Relations, Relations['categories'], true>;

export const mapCategory = (raw: CategoryRaw | null | undefined) => {
	if (!raw) return null;
	return {
		id: raw.id,
		name: raw.name,
		description: raw.description,
	};
};
