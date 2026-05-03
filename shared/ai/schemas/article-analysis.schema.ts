import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

import { ANALYZE_ARTICLE_SEVERITY } from '../constants/analyze-article-severity';

export const ArticleAnalysisSchema = z.object({
	articleId: zUuid(),
	analysis: z.string(),
	suggestions: z.array(z.string()),
	severity: z.enum(ANALYZE_ARTICLE_SEVERITY),
});

export type ArticleAnalysis = z.infer<typeof ArticleAnalysisSchema>;
