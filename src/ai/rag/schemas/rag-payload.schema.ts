import { zUuid } from 'shared/common/utils/zod/z-uuid.util';
import { z } from 'zod';

import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';

export const RagPayloadSchema = z.object({
	text: z.string(),
	metadata: z.object({
		articleId: zUuid(),
		title: z.string(),
		category: z.string(),
		articleStatus: z.enum(ARTICLE_STATUS),
		tags: z.array(z.string()),
	}),
});

export type RagPayload = z.infer<typeof RagPayloadSchema>;
