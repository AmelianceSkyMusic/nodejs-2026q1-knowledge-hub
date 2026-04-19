import { timestamp, uuid } from 'drizzle-orm/pg-core';

export const pgBase = () => ({
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp({ precision: 3, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'date' })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});
