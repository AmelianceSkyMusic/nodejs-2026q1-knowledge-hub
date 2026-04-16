import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { CreateComment } from 'shared/comments/schemas/create-comment.schema';
import { GetCommentsWithPaginationQuery } from 'shared/comments/schemas/get-comment-with-pagination-query.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { pgError } from 'src/common/utils/pg-error';

import { CommentsRepository } from './repositories/comments.repository';

import { ERROR } from 'shared/common/constants/error';

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

	async create(createComment: CreateComment) {
		try {
			const result = await this.commentsRepository.create(createComment);
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

	async remove(id: Id) {
		const result = await this.commentsRepository.remove(id);
		if (!result) throw new NotFoundException(ERROR.COMMENT.NOT_FOUND);
		return result;
	}
}
