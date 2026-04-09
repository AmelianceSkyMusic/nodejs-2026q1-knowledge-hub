import type { ArticleStatus } from 'src/_shared/articles/types/article-status';
import type { Id } from 'src/_shared/common/schemas/id.schema';

export class ArticleEntity {
	id: Id;
	title: string;
	content: string;
	status: ArticleStatus;
	authorId: Id | null;
	categoryId: Id | null;
	tags: string[];
	createdAt: number;
	updatedAt: number;
}
