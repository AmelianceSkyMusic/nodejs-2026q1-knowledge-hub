import type { ArticleSortBy } from 'shared/articles/types/article-sort-by';
import type { ArticleStatus } from 'shared/articles/types/article-status';
import type { Id } from 'shared/common/schemas/id.schema';
import type { Order } from 'shared/common/types/order';

export type FindMany = {
	ids: Id[];
	status?: ArticleStatus;
	categoryId?: Id;
	tag?: string[];
	sortBy?: ArticleSortBy;
	order?: Order;
};
