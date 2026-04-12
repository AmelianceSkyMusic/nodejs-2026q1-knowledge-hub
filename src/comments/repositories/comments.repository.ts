import { Injectable } from '@nestjs/common';
import { CreateComment } from 'shared/comments/schemas/create-comment.schema';
import { GetCommentsWithPaginationQuery } from 'shared/comments/schemas/get-comment-with-pagination-query.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { PrismaService } from 'src/prisma/prisma.service';

import { mapComment } from '../mappers/comments.mapper';

@Injectable()
export class CommentsRepository {
	constructor(private prisma: PrismaService) {}

	async findAll(getCommentsWithPaginationQuery: GetCommentsWithPaginationQuery) {
		const { articleId, page, limit, sortBy, order } = getCommentsWithPaginationQuery;
		if (!page) {
			const result = await this.prisma.comment.findMany({
				orderBy: { [sortBy]: order },
				where: { articleId },
			});
			return result.map(mapComment);
		}

		return await this.prisma.$transaction(async (tx) => {
			const total = await tx.comment.count({ where: { articleId } });
			if (total === 0) return { total, page, limit, data: [] };

			const pages = Math.ceil(total / limit) || 1;
			const currentPage = Math.min(Math.max(1, page), pages);
			const offset = (currentPage - 1) * limit;

			const result = await tx.comment.findMany({
				skip: offset,
				take: limit,
				orderBy: { [sortBy]: order },
				where: { articleId },
			});

			const data = result.map(mapComment);

			return { total, page: currentPage, limit, data };
		});
	}

	async findOne(id: Id) {
		const result = await this.prisma.comment.findUnique({ where: { id } });
		if (!result) return null;
		return mapComment(result);
	}

	async create(createComment: CreateComment) {
		const result = await this.prisma.comment.create({ data: createComment });
		return mapComment(result);
	}

	async remove(id: Id) {
		return await this.prisma.comment.delete({ where: { id } });
	}
}
