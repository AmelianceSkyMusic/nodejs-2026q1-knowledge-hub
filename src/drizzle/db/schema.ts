import { index, pgEnum, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { pgBase } from './pg-base';

export const userRole = pgEnum('user_role', ['admin', 'editor', 'viewer']);

export const users = pgTable('users', {
	...pgBase(),
	login: text().unique().notNull(),
	password: text().notNull(),
	role: userRole().notNull().default('viewer'),
});

export const articleStatus = pgEnum('article_status', ['draft', 'published', 'archived']);

export const articles = pgTable(
	'articles',
	{
		...pgBase(),
		title: text().notNull(),
		content: text().notNull(),
		status: articleStatus().default('draft').notNull(),

		authorId: uuid().references(() => users.id, { onDelete: 'set null' }),
		categoryId: uuid().references(() => categories.id, { onDelete: 'set null' }),
	},
	(table) => [index('status_idx').on(table.status), index('category_id_idx').on(table.categoryId)],
);

export const comments = pgTable('comments', {
	id: pgBase().id,
	createdAt: pgBase().createdAt,
	content: text().notNull(),

	authorId: uuid().references(() => users.id, { onDelete: 'cascade' }),
	articleId: uuid()
		.references(() => articles.id, { onDelete: 'cascade' })
		.notNull(),
});

export const categories = pgTable('categories', {
	id: pgBase().id,
	name: text().notNull(),
	description: text().notNull(),
});

export const tags = pgTable('tags', {
	id: pgBase().id,
	name: text().unique().notNull(),
});

export const tokens = pgTable('tokens', {
	id: pgBase().id,
	createdAt: pgBase().createdAt,
	userId: uuid()
		.unique()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: text().notNull(),
});

export const articleToTag = pgTable(
	'article_to_tags',
	{
		articleId: uuid()
			.notNull()
			.references(() => articles.id, { onDelete: 'cascade' }),
		tagId: uuid()
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' }),
	},
	(table) => [primaryKey({ columns: [table.articleId, table.tagId] })],
);

export type UserEntity = typeof users.$inferSelect;
export type ArticleEntity = typeof articles.$inferSelect;
export type CommentEntity = typeof comments.$inferSelect;
export type CategoryEntity = typeof categories.$inferSelect;
export type TagEntity = typeof tags.$inferSelect;
export type TokenEntity = typeof tokens.$inferSelect;

export type ArticleWithRelationsEntity = ArticleEntity & {
	author: UserEntity | null;
	category: CategoryEntity | null;
	tags: TagEntity[];
};
