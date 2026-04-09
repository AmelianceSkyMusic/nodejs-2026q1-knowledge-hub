import { z } from 'zod';

import { ArticleSchema } from './article.schema';

export const ArticlesWithPaginationSchema = z.object({
	total: z.number().int().nonnegative(),
	page: z.number().int().nonnegative(),
	limit: z.number().int().nonnegative(),
	data: z.array(ArticleSchema),
});

export type ArticlesWithPagination = z.output<typeof ArticlesWithPaginationSchema>;
