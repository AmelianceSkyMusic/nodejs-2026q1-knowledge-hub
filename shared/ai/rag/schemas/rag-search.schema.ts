import { z } from 'zod';

import { zUuid } from '../../../common/utils/zod/z-uuid.util';

export const RagSearchElementSchema = z.object({
	articleId: zUuid(),
	articleTitle: z.string(),
	chunk: z.string(),
	similarity: z.number(),
});

export type RagSearchElement = z.infer<typeof RagSearchElementSchema>;

export const RagSearchSchema = z.object({
	results: z.array(RagSearchElementSchema),
});

export type RagSearch = z.infer<typeof RagSearchSchema>;
