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
import { Id } from 'src/common/types/id';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesQueryDto } from './dto/get-articles-query-dto';
import { UpdateArticleDto } from './dto/update-article.dto';

import { ERROR } from 'src/common/constants/error';

@Controller('article')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	findAllByQuery(@Query() getArticlesQueryDto: GetArticlesQueryDto) {
		return this.articlesService.findAllByQuery(getArticlesQueryDto);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	findOne(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		const article = this.articlesService.findOne(id);
		if (!article) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);
		return article;
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() createArticleDto: CreateArticleDto) {
		return this.articlesService.create(createArticleDto);
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	update(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
		@Body() updateArticleDto: UpdateArticleDto,
	) {
		return this.articlesService.update(id, updateArticleDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.articlesService.remove(id);
	}
}
