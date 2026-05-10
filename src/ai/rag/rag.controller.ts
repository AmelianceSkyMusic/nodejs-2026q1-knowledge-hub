import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { AiThrottle } from 'src/common/decorators/ai-throttle.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

import { RagSearchDto } from './dto/rag-search.dto';
import { ReindexStatsDto } from './dto/reindex-stats.dto';
import { ReindexDto } from './dto/reindex.dto';
import { SearchRagDto } from './dto/search-rag.dto';
import { RagService } from './rag.service';

import { USER_ROLES } from 'shared/users/constants/user-role';

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
		const result = await this.ragService.search(searchRagDto);
		console.log(JSON.stringify(result, null, 2));
		return result;
	}
}
