import { z } from 'zod';

import { AI_DEFAULTS } from '../constants/ai-defaults';
import { ANALYZE_ARTICLE_TASK } from '../constants/analyze-article-task';

/** Request schema without defaults for frontend */
export const AnalyzeArticleRequestSchema = z.object({
	task: z.enum(ANALYZE_ARTICLE_TASK).optional(),
});

/** Validated schema with defaults for backend */
export const AnalyzeArticleSchema = AnalyzeArticleRequestSchema.extend({
	task: AnalyzeArticleRequestSchema.shape.task.default(AI_DEFAULTS.ANALYZE_ARTICLE_TASK),
});

/** Request type without defaults for frontend */
export type AnalyzeArticleRequest = z.input<typeof AnalyzeArticleRequestSchema>;

/** Validated type with defaults for backend */
export type AnalyzeArticle = z.output<typeof AnalyzeArticleSchema>;
