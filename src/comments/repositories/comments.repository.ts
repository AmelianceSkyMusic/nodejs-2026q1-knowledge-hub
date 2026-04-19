import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateComment } from 'shared/comments/schemas/create-comment.schema';
import { GetCommentsWithPaginationQuery } from 'shared/comments/schemas/get-comment-with-pagination-query.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { InjectDrizzle } from 'src/drizzle/decorators/drizzle.decorator';
import { DrizzleDb } from 'src/drizzle/types/drizzle-db';
import { calculatePagination } from 'src/drizzle/utils/calculate-pagination';

import * as schema from '../../drizzle/db/schema';

@Injectable()
export class CommentsRepository {
	constructor(@InjectDrizzle() private readonly db: DrizzleDb) {}

	async findAll(getCommentsWithPaginationQuery: GetCommentsWithPaginationQuery) {
		const { articleId, page, limit, sortBy, order } = getCommentsWithPaginationQuery;

		const baseQuery = { where: { articleId }, orderBy: { [sortBy]: order } };

		if (!page) return await this.db.query.comments.findMany(baseQuery);

		return await this.db.transaction(async (tx) => {
			const total = await tx.$count(schema.comments, eq(schema.comments.articleId, articleId));

			if (total === 0) return { total, page, limit, data: [] };

			const { currentPage, offset } = calculatePagination(total, page, limit);

			const result = await tx.query.comments.findMany({
				...baseQuery,
				offset,
				limit,
			});

			return { total, page: currentPage, limit, data: result };
		});
	}

	async findOne(id: Id) {
		return await this.db.query.comments.findFirst({
			where: { id },
		});
	}

	async create(createComment: CreateComment) {
		const [inserted] = await this.db.insert(schema.comments).values(createComment).returning();
		return inserted;
	}

	async remove(id: Id) {
		const [result] = await this.db
			.delete(schema.comments)
			.where(eq(schema.comments.id, id))
			.returning();
		return result;
	}
}
