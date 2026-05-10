import type { Comment } from 'shared/comments/schemas/comment.schema';
import type { CommentEntity } from 'src/drizzle/db/schema';

export class CommentMapper {
	static toComment(raw: CommentEntity): Comment {
		return {
			id: raw.id,
			content: raw.content,
			articleId: raw.articleId,
			authorId: raw.authorId,
			createdAt: raw.createdAt.getTime(),
		};
	}

	static toComments(raw: CommentEntity[]): Comment[] {
		return raw.map(this.toComment);
	}
}
