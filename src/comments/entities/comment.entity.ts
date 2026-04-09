import type { Id } from 'src/_shared/common/schemas/id.schema';

export class CommentEntity {
	id: Id;
	content: string;
	articleId: Id;
	authorId: Id | null;
	createdAt: number;
}
