import type { Article } from 'shared/articles/schemas/article.schema';
import type { Prisma } from 'src/generated/prisma/client';

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
