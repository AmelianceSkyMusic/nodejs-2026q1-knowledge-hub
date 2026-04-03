import type { Id } from 'src/common/types/id';

import type { ArticleStatus } from '../types/article-status';

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
