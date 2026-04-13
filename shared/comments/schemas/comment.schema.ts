import { z } from 'zod';

import { zTimestamp } from '../../common/utils/zod/z-timestamp.util';
import { zUuid } from '../../common/utils/zod/z-uuid.util';

export const CommentSchema = z.object({
	id: zUuid(),
	content: z.string(),
	articleId: zUuid(),
	authorId: zUuid().nullable(),
	createdAt: zTimestamp(),
});

export type Comment = z.output<typeof CommentSchema>;
