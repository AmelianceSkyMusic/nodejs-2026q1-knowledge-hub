import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ArticleSummarySchema } from 'shared/ai/schemas/article-summary.schema';

import { AI_SWAGGER } from './ai.swagger';

import type { ArticleSummary } from 'shared/ai/schemas/article-summary.schema';

export class ArticleSummaryDto extends createZodDto(ArticleSummarySchema) {
	@ApiProperty(AI_SWAGGER.ARTICLE_ID)
	articleId: ArticleSummary['articleId'];

	@ApiProperty(AI_SWAGGER.SUMMARY)
	summary: ArticleSummary['summary'];

	@ApiProperty(AI_SWAGGER.ORIGINAL_LENGTH)
	originalLength: ArticleSummary['originalLength'];

	@ApiProperty(AI_SWAGGER.SUMMARY_LENGTH)
	summaryLength: ArticleSummary['summaryLength'];
}
