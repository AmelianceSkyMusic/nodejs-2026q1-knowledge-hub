import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

import { ARTICLE_STATUS } from '../constants/article-status';

export const ArticleSchema = z.object({
	id: zUuid(),
	title: z.string(),
	content: z.string(),
	status: z.enum(ARTICLE_STATUS),
	authorId: zUuid().nullable(),
	categoryId: zUuid().nullable(),
	tags: z.array(z.string()),
	createdAt: z.number().int().nonnegative(),
	updatedAt: z.number().int().nonnegative(),
});

export type Article = z.infer<typeof ArticleSchema>;
