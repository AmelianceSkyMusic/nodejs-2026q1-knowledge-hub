import { Injectable } from '@nestjs/common';
import { Id } from 'shared/common/schemas/id.schema';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { UnprocessableEntityError } from 'src/common/errors/unprocessable-entity.error';
import { pgError } from 'src/common/utils/pg-error';

import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsWithPaginationQueryDto } from './dto/get-comment-with-pagination-query.dto';
import { CommentsRepository } from './repositories/comments.repository';

import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

@Injectable()
export class CommentsService {
	constructor(private readonly commentsRepository: CommentsRepository) {}

	async findAllForArticle(getCommentsWithPaginationQueryDto: GetCommentsWithPaginationQueryDto) {
		return await this.commentsRepository.findAll(getCommentsWithPaginationQueryDto);
	}

	async findById(id: Id) {
		const comment = await this.commentsRepository.findOne(id);
		if (!comment) throw new NotFoundError(ERROR.COMMENT.NOT_FOUND);
		return comment;
	}

	async create(createCommentDto: CreateCommentDto, user: JwtUserDto) {
		const authorId =
			createCommentDto.authorId === undefined ? user.userId : createCommentDto.authorId;
		try {
			const result = await this.commentsRepository.create({ ...createCommentDto, authorId });
			if (!result) throw new InternalServerError(ERROR.COMMENT.CREATE_FAILED);
			return result;
		} catch (error) {
			const dbError = pgError(error);

			if (dbError.isForeignKeyViolation) {
				throw new UnprocessableEntityError(ERROR.ARTICLE.NOT_FOUND);
			}

			throw error;
		}
	}

	async remove(id: Id, user: JwtUserDto) {
		if (user.role !== USER_ROLES.ADMIN) {
			const comment = await this.findById(id);
			if (comment.authorId !== user.userId) {
				throw new ForbiddenError(ERROR.ACCESS.ROLE);
			}
		}
		const result = await this.commentsRepository.remove(id);
		if (!result) throw new NotFoundError(ERROR.COMMENT.NOT_FOUND);
		return result;
	}
}
