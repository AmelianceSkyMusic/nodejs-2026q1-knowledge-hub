import { z } from 'zod';

import { AI_DEFAULTS } from '../constants/ai-defaults';
import { SUMMARIZE_ARTICLE_MAX_LENGTH } from '../constants/summarize-article-max-length';

/** Request schema without defaults for frontend */
export const SummarizeArticleRequestSchema = z.object({
	maxLength: z.enum(SUMMARIZE_ARTICLE_MAX_LENGTH).optional(),
});

/** Validated schema with defaults for backend */
export const SummarizeArticleSchema = SummarizeArticleRequestSchema.extend({
	maxLength: SummarizeArticleRequestSchema.shape.maxLength.default(
		AI_DEFAULTS.SUMMARIZE_ARTICLE_LENGTH,
	),
});

/** Request type without defaults for frontend */
export type SummarizeArticleRequest = z.input<typeof SummarizeArticleRequestSchema>;

/** Validated type with defaults for backend */
export type SummarizeArticle = z.output<typeof SummarizeArticleSchema>;
