import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { JwtUser } from 'shared/auth/schemas/jwt-user.schema';
import { CreateComment } from 'shared/comments/schemas/create-comment.schema';
import { GetCommentsWithPaginationQuery } from 'shared/comments/schemas/get-comment-with-pagination-query.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { pgError } from 'src/common/utils/pg-error';

import { CommentsRepository } from './repositories/comments.repository';

import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

@Injectable()
export class CommentsService {
	constructor(private readonly commentsRepository: CommentsRepository) {}

	async findAllForArticle(getCommentsWithPaginationQuery: GetCommentsWithPaginationQuery) {
		return await this.commentsRepository.findAll(getCommentsWithPaginationQuery);
	}

	async findById(id: Id) {
		const comment = await this.commentsRepository.findOne(id);
		if (!comment) throw new NotFoundException(ERROR.COMMENT.NOT_FOUND);
		return comment;
	}

	async create(createComment: CreateComment, user: JwtUser) {
		const authorId = user.userId;
		try {
			const result = await this.commentsRepository.create({ ...createComment, authorId });
			if (!result) throw new InternalServerErrorException(ERROR.COMMENT.CREATE_FAILED);
			return result;
		} catch (error) {
			const dbError = pgError(error);

			if (dbError.isForeignKeyViolation) {
				throw new UnprocessableEntityException(ERROR.ARTICLE.NOT_FOUND);
			}

			throw error;
		}
	}

	async remove(id: Id, user: JwtUser) {
		if (user.role !== USER_ROLES.ADMIN) {
			const comment = await this.findById(id);
			if (comment.authorId !== user.userId) {
				throw new ForbiddenException(ERROR.ACCESS.ROLE);
			}
		}
		const result = await this.commentsRepository.remove(id);
		if (!result) throw new NotFoundException(ERROR.COMMENT.NOT_FOUND);
		return result;
	}
}
