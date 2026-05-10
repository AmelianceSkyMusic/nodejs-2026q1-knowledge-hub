import { Injectable } from '@nestjs/common';
import { JwtUser } from 'shared/auth/schemas/jwt-user.schema';
import { CreateComment } from 'shared/comments/schemas/create-comment.schema';
import { GetCommentsWithPaginationQuery } from 'shared/comments/schemas/get-comment-with-pagination-query.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { UnprocessableEntityError } from 'src/common/errors/unprocessable-entity.error';
import { pgError } from 'src/common/utils/pg-error';

import { CommentMapper } from './mappers/comment.mapper';
import { CommentsRepository } from './repositories/comments.repository';

import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

@Injectable()
export class CommentsService {
	constructor(private readonly commentsRepository: CommentsRepository) {}

	async findAllForArticle(getCommentsWithPaginationQuery: GetCommentsWithPaginationQuery) {
		const result = await this.commentsRepository.findAll(getCommentsWithPaginationQuery);
		if ('data' in result) {
			return { ...result, data: CommentMapper.toComments(result.data) };
		}
		return CommentMapper.toComments(result);
	}

	async findById(id: Id) {
		const comment = await this.commentsRepository.findOne(id);
		if (!comment) throw new NotFoundError(ERROR.COMMENT.NOT_FOUND);
		return CommentMapper.toComment(comment);
	}

	async create(createComment: CreateComment, user: JwtUser) {
		const authorId = createComment.authorId === undefined ? user.userId : createComment.authorId;
		try {
			const result = await this.commentsRepository.create({ ...createComment, authorId });
			if (!result) throw new InternalServerError(ERROR.COMMENT.CREATE_FAILED);
			return CommentMapper.toComment(result);
		} catch (error) {
			const dbError = pgError(error);

			if (dbError.isForeignKeyViolation) {
				throw new UnprocessableEntityError(ERROR.ARTICLE.NOT_FOUND);
			}

			throw error;
		}
	}

	async remove(id: Id, user: JwtUser) {
		if (user.role !== USER_ROLES.ADMIN) {
			const comment = await this.findById(id);
			if (comment.authorId !== user.userId) {
				throw new ForbiddenError(ERROR.ACCESS.ROLE);
			}
		}
		const result = await this.commentsRepository.remove(id);
		if (!result) throw new NotFoundError(ERROR.COMMENT.NOT_FOUND);
		return CommentMapper.toComment(result);
	}
}
