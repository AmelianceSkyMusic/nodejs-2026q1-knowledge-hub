import { defineRelations } from 'drizzle-orm';

import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
	users: {
		articles: r.many.articles(),
		comments: r.many.comments(),
		token: r.one.tokens({
			from: r.users.id,
			to: r.tokens.userId,
		}),
	},

	articles: {
		author: r.one.users({
			from: r.articles.authorId,
			to: r.users.id,
		}),
		category: r.one.categories({
			from: r.articles.categoryId,
			to: r.categories.id,
		}),
		comments: r.many.comments(),
		tags: r.many.tags({
			from: r.articles.id.through(r.articleToTag.articleId),
			to: r.tags.id.through(r.articleToTag.tagId),
		}),
	},

	categories: {
		articles: r.many.articles(),
	},

	comments: {
		author: r.one.users({
			from: r.comments.authorId,
			to: r.users.id,
		}),
		article: r.one.articles({
			from: r.comments.articleId,
			to: r.articles.id,
			optional: false,
		}),
	},

	tags: {
		articles: r.many.articles({
			from: r.tags.id.through(r.articleToTag.tagId),
			to: r.articles.id.through(r.articleToTag.articleId),
		}),
	},

	tokens: {
		user: r.one.users({
			from: r.tokens.userId,
			to: r.users.id,
		}),
	},

	articleToTag: {
		article: r.one.articles({
			from: r.articleToTag.articleId,
			to: r.articles.id,
			optional: false,
		}),
		tag: r.one.tags({
			from: r.articleToTag.tagId,
			to: r.tags.id,
			optional: false,
		}),
	},
}));

export type Relations = typeof relations;
