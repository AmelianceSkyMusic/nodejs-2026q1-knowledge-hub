import { timestamp, uuid } from 'drizzle-orm/pg-core';

export const pgBase = () => ({
	id: uuid('id').defaultRandom().primaryKey(),
	createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});
