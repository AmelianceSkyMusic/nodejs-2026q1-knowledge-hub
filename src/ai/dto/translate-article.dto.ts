import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { TranslateArticleSchema } from 'shared/ai/schemas/translate-article.schema';

import { AI_SWAGGER } from './ai.swagger';

import type { TranslateArticle } from 'shared/ai/schemas/translate-article.schema';

export class TranslateArticleDto extends createZodDto(TranslateArticleSchema) {
	@ApiProperty(AI_SWAGGER.TARGET_LANGUAGE)
	targetLanguage: TranslateArticle['targetLanguage'];

	@ApiProperty(AI_SWAGGER.SOURCE_LANGUAGE)
	sourceLanguage?: TranslateArticle['sourceLanguage'];
}
