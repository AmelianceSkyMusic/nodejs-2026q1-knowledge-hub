import { z } from 'zod';

export const ReindexStatsSchema = z.object({
	indexedArticles: z.number(),
	indexedChunks: z.number(),
	vectorCollection: z.string(),
});

export type ReindexStats = z.infer<typeof ReindexStatsSchema>;
