import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { CreateComment } from 'src/_shared/comments/schemas/create-comment.schema';
import { GetCommentsWithPaginationQuery } from 'src/_shared/comments/schemas/get-comment-with-pagination-query.schema';
import { Id } from 'src/_shared/common/schemas/id.schema';

import { CommentsRepository } from './repositories/comments.repository';

import { ERROR } from 'src/_shared/common/constants/error';

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
			return await this.commentsRepository.create(createComment);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2003') {
					throw new UnprocessableEntityException(ERROR.ARTICLE.NOT_FOUND);
				}

				if (error.code === 'P2002') throw new ConflictException(ERROR.USER.ALREADY_EXISTS);
			}
			throw error;
		}
	}

	async remove(id: Id) {
		try {
			return await this.commentsRepository.remove(id);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException(ERROR.COMMENT.NOT_FOUND);
			}
			throw error;
		}
	}
}
