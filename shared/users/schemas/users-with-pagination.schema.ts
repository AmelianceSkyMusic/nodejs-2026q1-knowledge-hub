import { z } from 'zod';

import { UserSchema } from './user.schema';

export const UsersWithPaginationSchema = z.object({
	total: z.number().int().nonnegative(),
	page: z.number().int().nonnegative(),
	limit: z.number().int().nonnegative(),
	data: z.array(UserSchema),
});

export type UsersWithPagination = z.infer<typeof UsersWithPaginationSchema>;
