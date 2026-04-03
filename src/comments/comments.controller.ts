import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
} from '@nestjs/common';
import { Id } from 'src/common/types/id';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	findAllForArticle(@Query('articleId') articleId: Id) {
		return this.commentsService.findAllForArticle(articleId);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	findById(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.commentsService.findById(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() createCommentDto: CreateCommentDto) {
		return this.commentsService.create(createCommentDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.commentsService.remove(id);
	}
}
