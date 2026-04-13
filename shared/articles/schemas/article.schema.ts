import { z } from 'zod';

import { zTimestamp } from '../../common/utils/zod/z-timestamp.util';
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
	createdAt: zTimestamp(),
	updatedAt: zTimestamp(),
});

export type Article = z.infer<typeof ArticleSchema>;
