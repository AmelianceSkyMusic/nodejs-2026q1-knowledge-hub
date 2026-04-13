import type { Prisma } from 'src/generated/prisma/client';

export const mapCategory = (raw: Prisma.CategoryGetPayload<object>) => ({
	id: raw.id,
	name: raw.name,
	description: raw.description,
});
