import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { SummarizeArticleSchema } from 'shared/ai/schemas/summarize-article.schema';

import { AI_SWAGGER } from './ai.swagger';

import type { SummarizeArticle } from 'shared/ai/schemas/summarize-article.schema';

export class SummarizeArticleDto extends createZodDto(SummarizeArticleSchema) {
	@ApiProperty(AI_SWAGGER.MAX_LENGTH)
	maxLength: SummarizeArticle['maxLength'];
}
