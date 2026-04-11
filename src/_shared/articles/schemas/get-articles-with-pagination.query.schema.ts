import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

import { ORDER } from '../../common/constants/order';
import { ARTICLE_DEFAULTS } from '../constants/article-defaults';
import { ARTICLE_SORT_BY } from '../constants/article-sort-by';
import { ARTICLE_STATUS } from '../constants/article-status';

/** Request schema without defaults for frontend */
export const GetArticlesWithPaginationQueryRequestSchema = z.object({
	status: z.enum(ARTICLE_STATUS).optional(),
	categoryId: zUuid().optional(),
	tag: z
		.union([z.string(), z.array(z.string())])
		.transform((val) => (Array.isArray(val) ? val : [val]))
		.optional(),
	page: z.coerce.number<number>().int().min(1).optional(),
	limit: z.coerce.number<number>().int().min(1).optional(),
	sortBy: z.enum(ARTICLE_SORT_BY).optional(),
	order: z.enum(ORDER).optional(),
});

/** Validated schema with defaults for backend */
export const GetArticlesWithPaginationQuerySchema =
	GetArticlesWithPaginationQueryRequestSchema.extend({
		limit: GetArticlesWithPaginationQueryRequestSchema.shape.limit.default(
			ARTICLE_DEFAULTS.LIMIT,
		),
		sortBy: GetArticlesWithPaginationQueryRequestSchema.shape.sortBy.default(
			ARTICLE_DEFAULTS.SORT_BY,
		),
		order: GetArticlesWithPaginationQueryRequestSchema.shape.order.default(
			ARTICLE_DEFAULTS.ORDER,
		),
	});

/** Request type without defaults for frontend */
export type GetArticlesWithPaginationQueryRequest = z.input<
	typeof GetArticlesWithPaginationQueryRequestSchema
>;

/** Validated type with defaults for backend */
export type GetArticlesWithPaginationQuery = z.output<typeof GetArticlesWithPaginationQuerySchema>;
