import { relations } from 'drizzle-orm/relations';

import { articles, articleToTag, categories, comments, tags, users } from './schema';

export const articlesRelations = relations(articles, ({ one, many }) => ({
	user: one(users, {
		fields: [articles.authorId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [articles.categoryId],
		references: [categories.id],
	}),
	comments: many(comments),
	articleToTags: many(articleToTag),
}));

export const usersRelations = relations(users, ({ many }) => ({
	articles: many(articles),
	comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	articles: many(articles),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	user: one(users, {
		fields: [comments.authorId],
		references: [users.id],
	}),
	article: one(articles, {
		fields: [comments.articleId],
		references: [articles.id],
	}),
}));

export const articleToTagRelations = relations(articleToTag, ({ one }) => ({
	article: one(articles, {
		fields: [articleToTag.a],
		references: [articles.id],
	}),
	tag: one(tags, {
		fields: [articleToTag.b],
		references: [tags.id],
	}),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	articleToTags: many(articleToTag),
}));
