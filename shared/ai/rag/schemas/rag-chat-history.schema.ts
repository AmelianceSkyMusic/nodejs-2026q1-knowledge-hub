import { z } from 'zod';

export const RagChatMessageSchema = z.object({
	role: z.string().optional(),
	parts: z
		.array(
			z.object({
				text: z.string().optional(),
			}),
		)
		.optional(),
});

export const RagChatHistorySchema = z.object({
	id: z.string(),
	messages: z.array(RagChatMessageSchema),
});

export type RagChatHistory = z.infer<typeof RagChatHistorySchema>;
