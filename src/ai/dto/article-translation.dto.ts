import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ArticleTranslationSchema } from 'shared/ai/schemas/article-translation.schema';

import { AI_SWAGGER } from './ai.swagger';

import type { ArticleTranslation } from 'shared/ai/schemas/article-translation.schema';

export class ArticleTranslationDto extends createZodDto(ArticleTranslationSchema) {
	@ApiProperty(AI_SWAGGER.ARTICLE_ID)
	articleId: ArticleTranslation['articleId'];

	@ApiProperty(AI_SWAGGER.TRANSLATED_TEXT)
	translatedText: ArticleTranslation['translatedText'];

	@ApiProperty(AI_SWAGGER.DETECTED_LANGUAGE)
	detectedLanguage: ArticleTranslation['detectedLanguage'];
}
