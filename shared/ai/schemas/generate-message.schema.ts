import { z } from 'zod';

/** Request schema without defaults for frontend */
export const GenerateMessageRequestSchema = z.object({
	message: z.string(),
});

/** Validated schema with defaults for backend */
export const GenerateMessageSchema = GenerateMessageRequestSchema;

/** Request type without defaults for frontend */
export type GenerateMessageRequest = z.input<typeof GenerateMessageRequestSchema>;

/** Validated type with defaults for backend */
export type GenerateMessage = z.output<typeof GenerateMessageSchema>;
