import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

/** Request schema without defaults for frontend */
export const ChatRagRequestSchema = z.object({
	question: z.string(),
	conversationId: zUuid().optional(),
});

/** Validated schema with defaults for backend */
export const ChatRagSchema = ChatRagRequestSchema;

/** Request type without defaults for frontend */
export type ChatRagRequest = z.input<typeof ChatRagRequestSchema>;

/** Validated type with defaults for backend */
export type ChatRag = z.output<typeof ChatRagSchema>;
