import { CreateArticleRequestSchema } from './create-article.schema';

import type { z } from 'zod';

/** Request schema without defaults for frontend */
export const UpdateArticleRequestSchema = CreateArticleRequestSchema.omit({
	authorId: true,
}).partial();

/** Validated schema with defaults for backend */
export const UpdateArticleSchema = UpdateArticleRequestSchema;

/** Request type without defaults for frontend */
export type UpdateArticleRequest = z.input<typeof UpdateArticleRequestSchema>;

/** Validated type with defaults for backend */
export type UpdateArticle = z.output<typeof UpdateArticleSchema>;
