import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ArticleAnalysisSchema } from 'shared/ai/schemas/article-analysis.schema';

import { AI_SWAGGER } from './ai.swagger';

import type { ArticleAnalysis } from 'shared/ai/schemas/article-analysis.schema';

export class ArticleAnalysisDto extends createZodDto(ArticleAnalysisSchema) {
	@ApiProperty(AI_SWAGGER.ARTICLE_ID)
	articleId: ArticleAnalysis['articleId'];

	@ApiProperty(AI_SWAGGER.ANALYSIS)
	analysis: ArticleAnalysis['analysis'];

	@ApiProperty(AI_SWAGGER.SUGGESTIONS)
	suggestions: ArticleAnalysis['suggestions'];

	@ApiProperty(AI_SWAGGER.SEVERITY)
	severity: ArticleAnalysis['severity'];
}
