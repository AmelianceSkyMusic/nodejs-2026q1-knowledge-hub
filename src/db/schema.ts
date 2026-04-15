import { index, pgEnum, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { pgBase } from './pg-base';

export const userRole = pgEnum('UserRole', ['ADMIN', 'EDITOR', 'VIEWER']);

export const users = pgTable('users', {
	...pgBase(),
	login: text().unique().notNull(),
	password: text().notNull(),
	role: userRole().notNull().default('VIEWER'),
});

export const articleStatus = pgEnum('ArticleStatus', ['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export const articles = pgTable(
	'articles',
	{
		...pgBase(),
		title: text().notNull(),
		content: text().notNull(),
		status: articleStatus().default('DRAFT').notNull(),

		authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
		categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
	},
	(table) => [index('status_idx').on(table.status), index('category_id_idx').on(table.categoryId)],
);

export const comments = pgTable('comments', {
	id: pgBase().id,
	createdAt: pgBase().createdAt,
	content: text().notNull(),

	authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }),
	articleId: uuid('article_id')
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

export const articleToTag = pgTable(
	'article_to_tags',
	{
		articleId: uuid('A')
			.notNull()
			.references(() => articles.id, { onDelete: 'cascade' }),
		tagId: uuid('B')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' }),
	},
	(table) => [primaryKey({ columns: [table.articleId, table.tagId] })],
);
