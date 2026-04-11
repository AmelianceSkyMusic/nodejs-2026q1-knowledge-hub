import { z } from 'zod';

import { err } from '../../common/utils/zod/err.util';
import { zUuid } from '../../common/utils/zod/z-uuid.util';

import { ERROR } from '../../common/constants/error';
import { ARTICLE_DEFAULTS } from '../constants/article-defaults';
import { ARTICLE_STATUS } from '../constants/article-status';

/** Request schema without defaults for frontend */
export const CreateArticleRequestSchema = z.object({
	title: z
		.string(err(ERROR.ARTICLE.TITLE_IS_NOT_STRING))
		.trim()
		.min(1, ERROR.ARTICLE.TITLE_IS_EMPTY),
	content: z
		.string(err(ERROR.ARTICLE.CONTENT_IS_NOT_STRING))
		.trim()
		.min(1, ERROR.ARTICLE.CONTENT_IS_EMPTY),
	status: z.enum(ARTICLE_STATUS).optional(),
	authorId: zUuid().nullable().optional(),
	categoryId: zUuid().nullable().optional(),
	tags: z.array(z.string()).optional(),
});

/** Validated schema with defaults for backend */
export const CreateArticleSchema = CreateArticleRequestSchema.extend({
	status: CreateArticleRequestSchema.shape.status.default(ARTICLE_DEFAULTS.ARTICLE_STATUS),
	authorId: CreateArticleRequestSchema.shape.authorId.default(ARTICLE_DEFAULTS.AUTHOR_ID),
	categoryId: CreateArticleRequestSchema.shape.categoryId.default(ARTICLE_DEFAULTS.CATEGORY_ID),
	tags: CreateArticleRequestSchema.shape.tags.default([...ARTICLE_DEFAULTS.TAGS]),
});

/** Request type without defaults for frontend */
export type CreateArticleRequest = z.input<typeof CreateArticleRequestSchema>;

/** Validated type with defaults for backend */
export type CreateArticle = z.output<typeof CreateArticleSchema>;
