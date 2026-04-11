import { z } from 'zod';

import { CategorySchema } from './category.schema';

export const CategoriesWithPaginationSchema = z.object({
	total: z.number().int().nonnegative(),
	page: z.number().int().nonnegative(),
	limit: z.number().int().nonnegative(),
	data: z.array(CategorySchema),
});

export type CategoriesWithPagination = z.output<typeof CategoriesWithPaginationSchema>;
