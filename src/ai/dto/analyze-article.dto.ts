import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { AnalyzeArticleSchema } from 'shared/ai/schemas/analyze-article.schema';

import { AI_SWAGGER } from './ai.swagger';

import type { AnalyzeArticle } from 'shared/ai/schemas/analyze-article.schema';

export class AnalyzeArticleDto extends createZodDto(AnalyzeArticleSchema) {
	@ApiProperty(AI_SWAGGER.TASK)
	task: AnalyzeArticle['task'];
}
