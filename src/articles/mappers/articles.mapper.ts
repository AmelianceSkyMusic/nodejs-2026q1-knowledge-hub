import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';

import type { BuildQueryResult } from 'drizzle-orm';
import type { Relations } from 'src/drizzle/db/relations';

export type ArticleWithRelations = BuildQueryResult<
	Relations,
	Relations['articles'],
	{
		with: {
			tags: true;
			author: true;
			category: true;
		};
	}
>;

export const mapArticle = (raw: ArticleWithRelations) => {
	if (!raw) return null;
	return {
		id: raw.id,
		title: raw.title,
		content: raw.content,
		status: ARTICLE_STATUS[raw.status],
		authorId: raw.authorId,
		categoryId: raw.categoryId,
		tags: raw.tags.map((tag) => tag.name),
		createdAt: raw.createdAt.getTime(),
		updatedAt: raw.updatedAt.getTime(),
	};
};
