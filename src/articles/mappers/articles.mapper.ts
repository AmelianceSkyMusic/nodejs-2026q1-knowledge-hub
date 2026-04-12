import type { Prisma } from 'generated/prisma/client';
import type { Article } from 'src/_shared/articles/schemas/article.schema';

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
	include: { tags: true; author: true; category: true };
}>;

export const mapArticle = (raw: ArticleWithRelations) => ({
	id: raw.id,
	title: raw.title,
	content: raw.content,
	status: raw.status.toLowerCase() as Article['status'],
	authorId: raw.authorId,
	categoryId: raw.categoryId,
	tags: raw.tags.map((tag) => tag.name),
	createdAt: raw.createdAt.getTime(),
	updatedAt: raw.updatedAt.getTime(),
});
