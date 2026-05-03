import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

export const ArticleSummarySchema = z.object({
	articleId: zUuid(),
	summary: z.string(),
	originalLength: z.number(),
	summaryLength: z.number(),
});

export type ArticleSummary = z.infer<typeof ArticleSummarySchema>;
