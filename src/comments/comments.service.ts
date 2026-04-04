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

import { CreateCommentRequestDto } from './dto/request/create-comment.request.dto';
import { CommentsRepository } from './repositories/comments.repository';

import { ERROR } from 'src/common/constants/error';

@Injectable()
export class CommentsService {
	constructor(
		@Inject(forwardRef(() => ArticlesService))
		private readonly articlesService: ArticlesService,
		private readonly commentsRepository: CommentsRepository,
	) {}

	findAllForArticle(articleId: Id) {
		const allComments = this.commentsRepository.findAll();
		return allComments.filter((comment) => comment.articleId === articleId);
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
