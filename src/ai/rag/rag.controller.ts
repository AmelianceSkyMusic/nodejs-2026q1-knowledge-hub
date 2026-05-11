import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { AiThrottle } from 'src/common/decorators/ai-throttle.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';

import { ChatRagDto } from './dto/chat-rag.dto';
import { RagChatHistoryDto } from './dto/rag-chat-history.dto';
import { RagChatDto } from './dto/rag-chat.dto';
import { RagSearchDto } from './dto/rag-search.dto';
import { ReindexStatsDto } from './dto/reindex-stats.dto';
import { ReindexDto } from './dto/reindex.dto';
import { SearchRagDto } from './dto/search-rag.dto';
import { RagService } from './rag.service';

import { USER_ROLES } from 'shared/users/constants/user-role';
import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('RAG')
@Roles(USER_ROLES.EDITOR, USER_ROLES.VIEWER)
@AiThrottle()
@Controller('ai/rag')
export class RagController {
	constructor(private readonly ragService: RagService) {}

	@Post('index')
	@ApiOperation({
		summary: 'Index Knowledge Hub data',
		description: 'Builds or refreshes vector index using articles from Knowledge Hub DB.',
	})
	@ApiOkResponse({ description: 'Successful operation', type: ReindexStatsDto })
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: ReindexStatsDto })
	async index(@Body() reindexDto: ReindexDto) {
		console.log('reindexDto: ', reindexDto);
		return await this.ragService.index(reindexDto);
	}

	@Post('search')
	@ApiOperation({
		summary: 'Semantic search in Knowledge Hub',
		description:
			'Performs semantic search in Knowledge Hub using articles from Knowledge Hub DB.',
	})
	@ApiOkResponse({ description: 'Successful operation', type: RagSearchDto })
	@ApiBadRequestResponse({ description: 'Query is missing or invalid' })
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: RagSearchDto })
	async search(@Body() searchRagDto: SearchRagDto) {
		return await this.ragService.search(searchRagDto);
	}

	@Post('chat')
	@ApiOperation({
		summary: 'Chat with Knowledge Hub RAG',
		description:
			'Performs semantic search in Knowledge Hub using articles from Knowledge Hub DB.',
	})
	@ApiOkResponse({ description: 'Successful operation', type: RagChatDto })
	@ApiBadRequestResponse({ description: 'Question is missing or invalid' })
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: RagChatDto })
	async chat(@Body() chatRagDto: ChatRagDto) {
		return await this.ragService.chat(chatRagDto);
	}

	@Delete('index/articles/:id')
	@ApiOperation({
		summary: 'Delete article from index',
		description: 'Removes all vector entries linked to article.',
	})
	@ApiNoContentResponse({ description: 'Vectors were removed' })
	@ApiNotFoundResponse({ description: 'Article or index entries not found' })
	@ApiBadRequestResponse({ description: 'Query is missing or invalid' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Article ID',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param() { id: articleId }: IdParamDto) {
		return await this.ragService.remove(articleId);
	}

	@ApiOperation({
		summary: 'Get chat history',
		description: 'Returns conversation history',
	})
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Conversation ID',
		format: SWAGGER.FORMAT.ID,
	})
	@ApiOkResponse({ description: 'Successful operation', type: RagChatHistoryDto })
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: RagChatHistoryDto })
	@Get('chat/:id/history')
	async getChatHistory(@Param() { id: conversationId }: IdParamDto) {
		return await this.ragService.getChatHistory(conversationId);
	}
}
