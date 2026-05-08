import { zUuid } from 'shared/common/utils/zod/z-uuid.util';
import { z } from 'zod';

import { RAG_DEFAULTS } from '../constants/rag-defaults';
import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';
import { ERROR_WITH_PARAMS } from 'shared/common/constants/error-with-params';

/** Request schema without defaults for frontend */
export const SearchRagRequestSchema = z.object({
	query: z.string(),
	limit: z
		.number()
		.max(
			RAG_DEFAULTS.SEARCH.MAX_LIMIT,
			ERROR_WITH_PARAMS.RAG.MAX_SEARCH_LIMIT(RAG_DEFAULTS.SEARCH.MAX_LIMIT),
		)
		.optional(),
	articleStatus: z.enum(ARTICLE_STATUS).optional(),
	categoryId: zUuid().optional(),
	tags: z.array(zUuid()).optional(),
});

/** Validated schema with defaults for backend */
export const SearchRagSchema = SearchRagRequestSchema.extend({
	limit: SearchRagRequestSchema.shape.limit
		.default(RAG_DEFAULTS.SEARCH.LIMIT)
		.transform((value) => Math.min(value, RAG_DEFAULTS.SEARCH.MAX_LIMIT)),
});

/** Request type without defaults for frontend */
export type SearchRagRequest = z.input<typeof SearchRagRequestSchema>;

/** Validated type with defaults for backend */
export type SearchRag = z.output<typeof SearchRagSchema>;
