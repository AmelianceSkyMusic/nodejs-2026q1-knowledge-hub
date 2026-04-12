import { z } from 'zod';

import { GetCommentsQuerySchema } from './get-comment-query.schema';

import { ORDER } from '../../common/constants/order';
import { COMMENT_DEFAULTS } from '../constants/comment-defaults';
import { COMMENT_SORT_BY } from '../constants/comment-sort-by';

/** Request schema without defaults for frontend */
export const GetCommentsWithPaginationQueryRequestSchema = GetCommentsQuerySchema.extend({
	page: z.coerce.number<number>().int().min(1).optional(),
	limit: z.coerce.number<number>().int().min(1).optional(),
	sortBy: z.enum(COMMENT_SORT_BY).optional(),
	order: z.enum(ORDER).optional(),
});

/** Validated schema with defaults for backend */
export const GetCommentsWithPaginationQuerySchema =
	GetCommentsWithPaginationQueryRequestSchema.extend({
		limit: GetCommentsWithPaginationQueryRequestSchema.shape.limit.default(
			COMMENT_DEFAULTS.LIMIT,
		),
		sortBy: GetCommentsWithPaginationQueryRequestSchema.shape.sortBy.default(
			COMMENT_DEFAULTS.SORT_BY,
		),
		order: GetCommentsWithPaginationQueryRequestSchema.shape.order.default(
			COMMENT_DEFAULTS.ORDER,
		),
	});

/** Request type without defaults for frontend */
export type GetCommentsWithPaginationRequestQuery = z.input<
	typeof GetCommentsWithPaginationQueryRequestSchema
>;

/** Validated type with defaults for backend */
export type GetCommentsWithPaginationQuery = z.output<typeof GetCommentsWithPaginationQuerySchema>;
