import type { Id } from 'src/common/types/id';

export class CommentEntity {
	id: Id;
	content: string;
	articleId: Id;
	authorId: Id | null;
	createdAt: number;
}
