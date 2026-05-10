import type { Article } from 'shared/articles/schemas/article.schema';
import type { ArticleWithRelationsEntity } from 'src/drizzle/db/schema';

export class ArticleMapper {
	static toArticle(raw: ArticleWithRelationsEntity): Article {
		return {
			id: raw.id,
			title: raw.title,
			content: raw.content,
			status: raw.status,
			authorId: raw.authorId,
			categoryId: raw.categoryId,
			tags: raw.tags.map((tag) => tag.name),
			createdAt: raw.createdAt.getTime(),
			updatedAt: raw.updatedAt.getTime(),
		};
	}

	static toArticles(raw: ArticleWithRelationsEntity[]): Article[] {
		return raw.map(this.toArticle);
	}
}
