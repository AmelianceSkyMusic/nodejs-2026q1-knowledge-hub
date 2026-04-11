import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

export const CommentSchema = z.object({
	id: zUuid(),
	content: z.string(),
	articleId: zUuid(),
	authorId: zUuid().nullable(),
	createdAt: z.number().int().nonnegative(),
});

export type Comment = z.output<typeof CommentSchema>;
