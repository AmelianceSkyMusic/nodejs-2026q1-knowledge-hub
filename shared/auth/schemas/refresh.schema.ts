import z from 'zod';

/** Request schema without defaults for frontend */
export const RefreshRequestSchema = z.object({
	refreshToken: z.string().optional(),
});

/** Validated schema with defaults for backend */
export const RefreshSchema = RefreshRequestSchema;

/** Request type without defaults for frontend */
export type RefreshRequest = z.input<typeof RefreshRequestSchema>;

/** Validated type with defaults for backend */
export type Refresh = z.output<typeof RefreshSchema>;
