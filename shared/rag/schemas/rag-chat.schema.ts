import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

export const RagChatSourcesSchema = z.object({
	articleId: zUuid(),
	articleTitle: z.string(),
	relevantChunk: z.string(),
});

export type RagChatSources = z.infer<typeof RagChatSourcesSchema>;

export const RagChatSchema = z.object({
	answer: z.string(),
	sources: z.array(RagChatSourcesSchema),
	conversationId: zUuid(),
});

export type RagChat = z.infer<typeof RagChatSchema>;
