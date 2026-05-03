import { z } from 'zod';

/** Request schema without defaults for frontend */
export const TranslateArticleRequestSchema = z.object({
	targetLanguage: z.string(),
	sourceLanguage: z.string().optional(),
});

/** Validated schema with defaults for backend */
export const TranslateArticleSchema = TranslateArticleRequestSchema;

/** Request type without defaults for frontend */
export type TranslateArticleRequest = z.input<typeof TranslateArticleRequestSchema>;

/** Validated type with defaults for backend */
export type TranslateArticle = z.output<typeof TranslateArticleSchema>;
