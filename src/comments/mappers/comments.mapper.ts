import type { BuildQueryResult } from 'drizzle-orm';
import type { Relations } from 'src/drizzle/db/relations';

export type CommentRaw = BuildQueryResult<Relations, Relations['comments'], true>;

export const mapComment = (raw: CommentRaw) => {
	if (!raw) return null;
	return {
		id: raw.id,
		content: raw.content,
		articleId: raw.articleId,
		authorId: raw.authorId,
		createdAt: raw.createdAt.getTime(),
	};
};
