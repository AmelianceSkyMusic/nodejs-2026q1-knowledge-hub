import type { Prisma } from 'generated/prisma/client';

export const mapCategory = (raw: Prisma.CategoryGetPayload<object>) => ({
	id: raw.id,
	name: raw.name,
	description: raw.description,
});
