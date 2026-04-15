import { sql } from 'drizzle-orm';
import {
	foreignKey,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core';

export const articleStatus = pgEnum('ArticleStatus', ['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export const userRole = pgEnum('UserRole', ['ADMIN', 'EDITOR', 'VIEWER']);

export const prismaMigrations = pgTable('_prisma_migrations', {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'string' }),
	migrationName: varchar('migration_name', { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp('rolled_back_at', { withTimezone: true, mode: 'string' }),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' })
		.defaultNow()
		.notNull(),
	appliedStepsCount: integer('applied_steps_count').default(0).notNull(),
});

export const users = pgTable(
	'users',
	{
		id: text().primaryKey().notNull(),
		login: text().notNull(),
		password: text().notNull(),
		role: userRole().default('VIEWER').notNull(),
		createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' }).notNull(),
	},
	(table) => [
		uniqueIndex('users_login_key').using('btree', table.login.asc().nullsLast().op('text_ops')),
	],
);

export const articles = pgTable(
	'articles',
	{
		id: text().primaryKey().notNull(),
		title: text().notNull(),
		content: text().notNull(),
		status: articleStatus().default('DRAFT').notNull(),
		createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' }).notNull(),
		authorId: text('author_id'),
		categoryId: text('category_id'),
	},
	(table) => [
		index('articles_category_id_idx').using(
			'btree',
			table.categoryId.asc().nullsLast().op('text_ops'),
		),
		index('articles_status_idx').using('btree', table.status.asc().nullsLast().op('enum_ops')),
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: 'articles_author_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('set null'),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: 'articles_category_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('set null'),
	],
);

export const categories = pgTable('categories', {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
});

export const comments = pgTable(
	'comments',
	{
		id: text().primaryKey().notNull(),
		content: text().notNull(),
		createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		authorId: text('author_id'),
		articleId: text('article_id').notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: 'comments_author_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		foreignKey({
			columns: [table.articleId],
			foreignColumns: [articles.id],
			name: 'comments_article_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
	],
);

export const tags = pgTable(
	'tags',
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
	},
	(table) => [
		uniqueIndex('tags_name_key').using('btree', table.name.asc().nullsLast().op('text_ops')),
	],
);

export const articleToTag = pgTable(
	'_ArticleToTag',
	{
		a: text('A').notNull(),
		b: text('B').notNull(),
	},
	(table) => [
		index().using('btree', table.b.asc().nullsLast().op('text_ops')),
		foreignKey({
			columns: [table.a],
			foreignColumns: [articles.id],
			name: '_ArticleToTag_A_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		foreignKey({
			columns: [table.b],
			foreignColumns: [tags.id],
			name: '_ArticleToTag_B_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		primaryKey({ columns: [table.a, table.b], name: '_ArticleToTag_AB_pkey' }),
	],
);
