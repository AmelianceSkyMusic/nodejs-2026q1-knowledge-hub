import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ArticlesService } from 'src/articles/articles.service';
import { Id } from 'src/common/types/id';
import { sort } from 'src/common/utils/sort.util';

import { CreateCommentRequestDto } from './dto/request/create-comment.request.dto';
import { GetCommentsWithPaginationQueryRequestDto } from './dto/request/get-comment-with-pagination-query.request.dto';
import { CommentsRepository } from './repositories/comments.repository';

import { COMMENT_SORT_BY } from './constants/comment-sort-by';
import { ERROR } from 'src/common/constants/error';
import { ORDER } from 'src/common/constants/order';

@Injectable()
export class CommentsService {
	constructor(
		@Inject(forwardRef(() => ArticlesService))
		private readonly articlesService: ArticlesService,
		private readonly commentsRepository: CommentsRepository,
	) {}

	findAllForArticle(
		getCommentsWithPaginationQueryRequestDto: GetCommentsWithPaginationQueryRequestDto,
	) {
		const {
			articleId,
			page,
			limit = 10,
			sortBy = COMMENT_SORT_BY.CREATED_AT,
			order = ORDER.ASC,
		} = getCommentsWithPaginationQueryRequestDto;

		const allComments = this.commentsRepository.findAll();

		const filtered = allComments.filter((comment) => comment.articleId === articleId);

		const filteredAndSorted = sort(filtered, sortBy, order);
		if (!page) return filteredAndSorted;

		const offset = (page - 1) * limit;

		const paginatedData = filteredAndSorted.slice(offset, offset + limit);

		return {
			total: filteredAndSorted.length,
			page: Number(page),
			limit: Number(limit),
			data: paginatedData,
		};
	}

	findById(id: Id) {
		const comment = this.commentsRepository.findOne(id);
		if (!comment) throw new NotFoundException(ERROR.COMMENT.NOT_FOUND);
		return comment;
	}

	create(createCommentRequestDto: CreateCommentRequestDto) {
		const article = this.articlesService.findOne(createCommentRequestDto.articleId);
		if (!article) throw new UnprocessableEntityException(ERROR.ARTICLE.NOT_FOUND);

		const newComment = {
			...createCommentRequestDto,
			authorId: createCommentRequestDto.authorId ?? null,
			id: randomUUID(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		return this.commentsRepository.create(newComment);
	}

	remove(id: Id) {
		const isDeleted = this.commentsRepository.remove(id);
		if (!isDeleted) throw new NotFoundException(ERROR.COMMENT.NOT_FOUND);

		return isDeleted;
	}

	removeByArticleId(articleId: Id) {
		this.commentsRepository.removeByArticleId(articleId);
	}

	removeByAuthorId(authorId: Id) {
		this.commentsRepository.removeByAuthorId(authorId);
	}
}
