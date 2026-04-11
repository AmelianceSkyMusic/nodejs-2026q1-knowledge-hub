import { z } from 'zod';

import { ORDER } from '../../common/constants/order';
import { CATEGORY_DEFAULTS } from '../constants/category-defaults';
import { CATEGORY_SORT_BY } from '../constants/category-sort-by';

/** Request schema without defaults for frontend */
export const GetCategoriesWithPaginationQueryRequestSchema = z.object({
	page: z.coerce.number<number>().int().min(1).optional(),
	limit: z.coerce.number<number>().int().min(1).optional(),
	sortBy: z.enum(CATEGORY_SORT_BY).optional(),
	order: z.enum(ORDER).optional(),
});

/** Validated schema with defaults for backend */
export const GetCategoriesWithPaginationQuerySchema =
	GetCategoriesWithPaginationQueryRequestSchema.extend({
		limit: GetCategoriesWithPaginationQueryRequestSchema.shape.limit.default(
			CATEGORY_DEFAULTS.LIMIT,
		),
		sortBy: GetCategoriesWithPaginationQueryRequestSchema.shape.sortBy.default(
			CATEGORY_DEFAULTS.SORT_BY,
		),
		order: GetCategoriesWithPaginationQueryRequestSchema.shape.order.default(
			CATEGORY_DEFAULTS.ORDER,
		),
	});

/** Request type without defaults for frontend */
export type GetCategoriesWithPaginationRequestQuery = z.input<
	typeof GetCategoriesWithPaginationQueryRequestSchema
>;

/** Validated type with defaults for backend */
export type GetCategoriesWithPaginationQuery = z.output<
	typeof GetCategoriesWithPaginationQuerySchema
>;
