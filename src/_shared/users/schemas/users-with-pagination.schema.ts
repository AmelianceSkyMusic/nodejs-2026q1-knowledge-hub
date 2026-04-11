import { z } from 'zod';

import { UserSchema } from './user.schema';

export const UsersWithPaginationSchema = z.object({
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	data: z.array(UserSchema),
});

export type UsersWithPagination = z.infer<typeof UsersWithPaginationSchema>;
