import type { Prisma } from 'generated/prisma/client';

export const mapComment = (raw: Prisma.CommentGetPayload<object>) => ({
	id: raw.id,
	content: raw.content,
	articleId: raw.articleId,
	authorId: raw.authorId,
	createdAt: raw.createdAt.getTime(),
});
