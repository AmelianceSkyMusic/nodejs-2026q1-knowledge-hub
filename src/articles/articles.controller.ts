import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { Id } from 'src/common/types/id';

import { ArticlesService } from './articles.service';
import { CreateArticleRequestDto } from './dto/request/create-article.request.dto';
import { GetArticlesQueryRequestDto } from './dto/request/get-articles-query.request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article.request.dto';
import { ArticleResponseDto } from './dto/response/article.response.dto';

import { ERROR } from 'src/common/constants/error';
import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('Article')
@Controller('article')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	@ApiOperation({
		summary: 'Get articles list',
		description: 'Gets all articles. Supports filtering by status, categoryId, and tag.',
	})
	@ApiOkResponse({ description: 'Successful operation', type: [ArticleResponseDto] })
	@HttpCode(HttpStatus.OK)
	@Serialize(ArticleResponseDto)
	findAllByQuery(@Query() getArticlesQueryRequestDto: GetArticlesQueryRequestDto) {
		return this.articlesService.findAllByQuery(getArticlesQueryRequestDto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get single article by id', description: 'Gets single article by id' })
	@ApiOkResponse({ description: 'Successful operation', type: ArticleResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. ArticleId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Article was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Article id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@Serialize(ArticleResponseDto)
	findOne(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		const article = this.articlesService.findOne(id);
		if (!article) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);
		return article;
	}

	@Post()
	@ApiOperation({
		summary: 'Add new article',
		description: 'Add new article (editor can create own, admin can create any)',
	})
	@ApiCreatedResponse({ description: 'Article is created', type: ArticleResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. Body does not contain required fields' })
	@HttpCode(HttpStatus.CREATED)
	@Serialize(ArticleResponseDto)
	create(@Body() createArticleRequestDto: CreateArticleRequestDto) {
		return this.articlesService.create(createArticleRequestDto);
	}

	@Put(':id')
	@ApiOperation({
		summary: 'Update article information',
		description: 'Update article by UUID (editor can update own, admin can update any)',
	})
	@ApiOkResponse({ description: 'The article has been updated', type: ArticleResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. ArticleId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Article was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Article id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@Serialize(ArticleResponseDto)
	update(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
		@Body() updateArticleRequestDto: UpdateArticleRequestDto,
	) {
		return this.articlesService.update(id, updateArticleRequestDto);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete article',
		description: 'Delete article. Deletes all associated comments. (admin only)',
	})
	@ApiNoContentResponse({ description: 'Deleted successfully' })
	@ApiBadRequestResponse({ description: 'Bad request. ArticleId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Article was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Article id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.articlesService.remove(id);
	}
}
