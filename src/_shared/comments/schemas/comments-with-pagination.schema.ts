import { z } from 'zod';

import { CommentSchema } from './comment.schema';

export const CommentsWithPaginationSchema = z.object({
	total: z.number().int().nonnegative(),
	page: z.number().int().nonnegative(),
	limit: z.number().int().nonnegative(),
	data: z.array(CommentSchema),
});

export type CommentsWithPagination = z.output<typeof CommentsWithPaginationSchema>;
