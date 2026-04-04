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
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { Id } from 'src/common/types/id';

import { CommentsService } from './comments.service';
import { CreateCommentRequestDto } from './dto/request/create-comment.request.dto';
import { CommentResponseDto } from './dto/response/comment.response.dto';

import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Get()
	@ApiOperation({
		summary: 'Get all comments for an article',
		description: 'Gets all comments for a specific article. Requires articleId query parameter',
	})
	@ApiOkResponse({ description: 'Successful operation', type: [CommentResponseDto] })
	@ApiQuery({
		name: 'articleId',
		required: true,
		description: 'Article ID to get comments for',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@Serialize(CommentResponseDto)
	findAllForArticle(@Query('articleId') articleId: Id) {
		return this.commentsService.findAllForArticle(articleId);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get single comment by id', description: 'Gets single comment by id' })
	@ApiOkResponse({ description: 'Successful operation', type: CommentResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. CommentId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Comment was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Comment id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@Serialize(CommentResponseDto)
	findById(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.commentsService.findById(id);
	}

	@Post()
	@ApiOperation({
		summary: 'Create comment',
		description: 'Creates a new comment',
	})
	@ApiCreatedResponse({ description: 'Comment is created', type: CommentResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. Body does not contain required fields' })
	@HttpCode(HttpStatus.CREATED)
	@Serialize(CommentResponseDto)
	create(@Body() createCommentRequestDto: CreateCommentRequestDto) {
		return this.commentsService.create(createCommentRequestDto);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete comment',
		description: 'Delete comment (admin can delete any, editor can delete own)',
	})
	@ApiNoContentResponse({ description: 'Deleted successfully' })
	@ApiBadRequestResponse({ description: 'Bad request. CommentId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Comment was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Comment id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.commentsService.remove(id);
	}
}
