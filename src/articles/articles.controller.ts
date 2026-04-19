import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiExtraModels,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	getSchemaPath,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { IdParamDto } from 'shared/common/dto/id-param.dto';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import { ArticlesWithPaginationDto } from './dto/articles-with-pagination.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesWithPaginationQueryDto } from './dto/get-articles-with-pagination.query.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';
import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('Article')
@ApiExtraModels(ArticlesWithPaginationDto)
@Controller('article')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	@Roles(USER_ROLES.EDITOR, USER_ROLES.VIEWER)
	@ApiOperation({
		summary: 'Get articles list',
		description: 'Gets all articles. Supports filtering by status, categoryId, and tag.',
	})
	@ApiOkResponse({
		description: 'Successful operation',
		schema: {
			oneOf: [
				{ $ref: getSchemaPath(ArticleDto), type: 'array' },
				{ $ref: getSchemaPath(ArticlesWithPaginationDto) },
			],
		},
	})
	@HttpCode(HttpStatus.OK)
	async findAll(@Query() getArticlesWithPaginationQueryDto: GetArticlesWithPaginationQueryDto) {
		const result = await this.articlesService.findAll(getArticlesWithPaginationQueryDto);
		if ('data' in result) return ArticlesWithPaginationDto.create(result);
		return result.map((article) => ArticleDto.create(article));
	}

	@Get(':id')
	@Roles(USER_ROLES.EDITOR, USER_ROLES.VIEWER)
	@ApiOperation({ summary: 'Get single article by id', description: 'Gets single article by id' })
	@ApiOkResponse({ description: 'Successful operation', type: ArticleDto })
	@ApiBadRequestResponse({ description: 'Bad request. ArticleId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Article was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Article id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: ArticleDto })
	async findOne(@Param() { id }: IdParamDto) {
		const article = await this.articlesService.findOne(id);
		if (!article) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);
		return article;
	}

	@Post()
	@Roles(USER_ROLES.EDITOR)
	@ApiOperation({
		summary: 'Add new article',
		description: 'Add new article (editor can create own, admin can create any)',
	})
	@ApiCreatedResponse({ description: 'Article is created', type: ArticleDto })
	@ApiBadRequestResponse({ description: 'Bad request. Body does not contain required fields' })
	@HttpCode(HttpStatus.CREATED)
	@ZodResponse({ type: ArticleDto })
	async create(@Body() createArticleDto: CreateArticleDto, @CurrentUser() user: JwtUserDto) {
		return await this.articlesService.create(createArticleDto, user);
	}

	@Put(':id')
	@Roles(USER_ROLES.EDITOR)
	@ApiOperation({
		summary: 'Update article information',
		description: 'Update article by UUID (editor can update own, admin can update any)',
	})
	@ApiOkResponse({ description: 'The article has been updated', type: ArticleDto })
	@ApiBadRequestResponse({ description: 'Bad request. ArticleId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Article was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Article id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: ArticleDto })
	async update(
		@Param() { id }: IdParamDto,
		@Body() updateArticleDto: UpdateArticleDto,
		@CurrentUser() user: JwtUserDto,
	) {
		return await this.articlesService.update(id, updateArticleDto, user);
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
	async remove(@Param() { id }: IdParamDto) {
		return await this.articlesService.remove(id);
	}
}
