import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
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
	ApiQuery,
	ApiTags,
	getSchemaPath,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { IdParamDto } from 'src/_shared/common/dto/id-param.dto';

import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { CommentsWithPaginationDto } from './dto/comments-with-pagination.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsWithPaginationQueryDto } from './dto/get-comment-with-pagination-query.dto';

import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('Comment')
@ApiExtraModels(CommentsWithPaginationDto)
@Controller('comment')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Get()
	@ApiOperation({
		summary: 'Get all comments for an article',
		description: 'Gets all comments for a specific article. Requires articleId query parameter',
	})
	@ApiOkResponse({
		description: 'Successful operation',
		schema: {
			oneOf: [
				{ $ref: getSchemaPath(CommentDto), type: 'array' },
				{ $ref: getSchemaPath(CommentsWithPaginationDto) },
			],
		},
	})
	@ApiQuery({
		name: 'articleId',
		required: true,
		description: 'Article ID to get comments for',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	findAllForArticle(
		@Query()
		getCommentsWithPaginationQueryDto: GetCommentsWithPaginationQueryDto,
	) {
		const result = this.commentsService.findAllForArticle(getCommentsWithPaginationQueryDto);
		if ('data' in result) return CommentsWithPaginationDto.create(result);
		return result.map((item) => CommentDto.create(item));
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get single comment by id', description: 'Gets single comment by id' })
	@ApiOkResponse({ description: 'Successful operation', type: CommentDto })
	@ApiBadRequestResponse({ description: 'Bad request. CommentId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Comment was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Comment id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: CommentDto })
	findById(@Param() { id }: IdParamDto) {
		return this.commentsService.findById(id);
	}

	@Post()
	@ApiOperation({
		summary: 'Create comment',
		description: 'Creates a new comment',
	})
	@ApiCreatedResponse({ description: 'Comment is created', type: CommentDto })
	@ApiBadRequestResponse({ description: 'Bad request. Body does not contain required fields' })
	@HttpCode(HttpStatus.CREATED)
	@ZodResponse({ type: CommentDto })
	create(@Body() createCommentDto: CreateCommentDto) {
		return this.commentsService.create(createCommentDto);
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
	remove(@Param() { id }: IdParamDto) {
		return this.commentsService.remove(id);
	}
}
