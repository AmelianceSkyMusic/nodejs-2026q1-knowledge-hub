import { z } from 'zod';

import { ORDER } from '../../common/constants/order';
import { USER_DEFAULTS } from '../constants/user-defaults';
import { USER_SORT_BY } from '../constants/user-sort-by';

/** Request schema without defaults for frontend */
export const GetUsersWithPaginationQueryRequestSchema = z.object({
	page: z.coerce.number<number>().int().min(1).optional(),
	limit: z.coerce.number<number>().int().min(1).optional(),
	sortBy: z.enum(USER_SORT_BY).optional(),
	order: z.enum(ORDER).optional(),
});

/** Validated schema with defaults for backend */
export const GetUsersWithPaginationQuerySchema = GetUsersWithPaginationQueryRequestSchema.extend({
	limit: GetUsersWithPaginationQueryRequestSchema.shape.limit.default(USER_DEFAULTS.LIMIT),
	sortBy: GetUsersWithPaginationQueryRequestSchema.shape.sortBy.default(USER_DEFAULTS.SORT_BY),
	order: GetUsersWithPaginationQueryRequestSchema.shape.order.default(USER_DEFAULTS.ORDER),
});

/** Request type without defaults for frontend */
export type GetUsersWithPaginationQueryRequest = z.input<
	typeof GetUsersWithPaginationQueryRequestSchema
>;

/** Validated type with defaults for backend */
export type GetUsersWithPaginationQuery = z.output<typeof GetUsersWithPaginationQuerySchema>;
