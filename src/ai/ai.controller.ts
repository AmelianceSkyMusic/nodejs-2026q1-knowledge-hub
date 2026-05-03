import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { AiThrottle } from 'src/common/decorators/ai-throttle.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';

import { AiService } from './ai.service';
import { AnalyzeArticleDto } from './dto/analyze-article.dto';
import { ArticleAnalysisDto } from './dto/article-analysis.dto';
import { ArticleSummaryDto } from './dto/article-summary.dto';
import { ArticleTranslationDto } from './dto/article-translation.dto';
import { GenerateMessageDto } from './dto/generate-message.dto';
import { MessageDto } from './dto/message.dto';
import { SummarizeArticleDto } from './dto/summarize-article.dto';
import { TranslateArticleDto } from './dto/translate-article.dto';

import { USER_ROLES } from 'shared/users/constants/user-role';
import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('Ai')
@Roles(USER_ROLES.EDITOR, USER_ROLES.VIEWER)
@AiThrottle()
@Controller('ai')
export class AiController {
	constructor(private readonly aiService: AiService) {}

	@Post('articles/:id/summarize')
	@ApiOperation({
		summary: 'Summarize article',
		description: 'Summarizes an existing article from the database',
	})
	@ApiOkResponse({ description: 'Successful operation', type: ArticleSummaryDto })
	@ApiNotFoundResponse({ description: 'Article was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Article id',
		format: SWAGGER.FORMAT.ID,
	})
	@ZodResponse({ type: ArticleSummaryDto })
	async summarizeArticle(
		@Param() { id: articleId }: IdParamDto,
		@Body() summarizeArticleDto: SummarizeArticleDto,
	) {
		return await this.aiService.summarizeArticle(articleId, summarizeArticleDto);
	}

	@Post('articles/:id/translate')
	@ApiOperation({
		summary: 'Translate article',
		description: 'Translates an existing article from the database',
	})
	@ApiOkResponse({ description: 'Successful operation', type: ArticleTranslationDto })
	@ApiNotFoundResponse({ description: 'Article was not found' })
	@ApiBadRequestResponse({ description: 'Target language is missing or invalid' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Article id',
		format: SWAGGER.FORMAT.ID,
	})
	@ZodResponse({ type: ArticleTranslationDto })
	async translateArticle(
		@Param() { id: articleId }: IdParamDto,
		@Body() translateArticleDto: TranslateArticleDto,
	) {
		return await this.aiService.translateArticle(articleId, translateArticleDto);
	}

	@Post('articles/:id/analyze')
	@ApiOperation({
		summary: 'Analyze article',
		description: 'Analyzes an existing article from the database',
	})
	@ApiOkResponse({ description: 'Successful operation', type: ArticleAnalysisDto })
	@ApiNotFoundResponse({ description: 'Article was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Article id',
		format: SWAGGER.FORMAT.ID,
	})
	@ZodResponse({ type: ArticleAnalysisDto })
	async analyzeArticle(
		@Param() { id: articleId }: IdParamDto,
		@Body() analyzeArticleDto: AnalyzeArticleDto,
	) {
		return await this.aiService.analyzeArticle(articleId, analyzeArticleDto);
	}

	@Post('generate')
	@ApiOkResponse({ description: 'Successful operation', type: MessageDto })
	@ApiOperation({
		summary: 'Generate message',
		description: 'Generates a message',
	})
	@ZodResponse({ type: MessageDto })
	async generateMessage(
		@CurrentUser() { userId }: JwtUserDto,
		@Body() generateMessageDto: GenerateMessageDto,
	) {
		return await this.aiService.generateMessage(userId, generateMessageDto);
	}

	@Get('statistics')
	@ApiOperation({
		summary: 'Get AI usage statistics',
		description: 'Returns statistics for AI requests',
	})
	async getStatistics() {
		return await this.aiService.getStatistics();
	}
}
