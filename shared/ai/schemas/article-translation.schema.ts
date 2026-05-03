import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

export const ArticleTranslationSchema = z.object({
	articleId: zUuid(),
	translatedText: z.string(),
	detectedLanguage: z.string(),
});

export type ArticleTranslation = z.infer<typeof ArticleTranslationSchema>;
