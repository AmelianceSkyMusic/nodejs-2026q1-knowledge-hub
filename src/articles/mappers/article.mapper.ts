import { CategoryMapper } from 'src/categories/mappers/category.mapper';
import { UserMapper } from 'src/users/mappers/user.mapper';

import type { ArticleWithRelations } from 'shared/articles/schemas/article-with-relations.schema';
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

	static toArticleWithRelations(raw: ArticleWithRelationsEntity): ArticleWithRelations {
		return {
			...this.toArticle(raw),
			author: raw.author ? UserMapper.toUser(raw.author) : null,
			category: raw.category ? CategoryMapper.toCategory(raw.category) : null,
		};
	}

	static toArticlesWithRelations(raw: ArticleWithRelationsEntity[]): ArticleWithRelations[] {
		return raw.map((item) => this.toArticleWithRelations(item));
	}
}
