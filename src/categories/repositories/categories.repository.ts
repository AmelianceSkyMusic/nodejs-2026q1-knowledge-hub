import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateCategory } from 'shared/categories/schemas/create-category.schema';
import { GetCategoriesWithPaginationQuery } from 'shared/categories/schemas/get-categories-with-pagination-query.schema';
import { UpdateCategory } from 'shared/categories/schemas/update-category.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { InjectDrizzle } from 'src/drizzle/decorators/drizzle.decorator';
import { DrizzleDb } from 'src/drizzle/types/drizzle-db';
import { calculatePagination } from 'src/drizzle/utils/calculate-pagination';

import * as schema from '../../drizzle/db/schema';
import { mapCategory } from '../mapper/categories.mapper';

@Injectable()
export class CategoriesRepository {
	constructor(@InjectDrizzle() private readonly db: DrizzleDb) {}

	async findAll(getCategoriesWithPaginationQuery: GetCategoriesWithPaginationQuery) {
		const { page, limit, sortBy, order } = getCategoriesWithPaginationQuery;

		const orderBy = { [sortBy]: order };

		if (!page) {
			const result = await this.db.query.categories.findMany({ orderBy });
			return result.map(mapCategory);
		}

		return await this.db.transaction(async (tx) => {
			const total = await tx.$count(schema.categories);
			if (total === 0) return { total, page, limit, data: [] };

			const { currentPage, offset } = calculatePagination(total, page, limit);

			const result = await tx.query.categories.findMany({
				offset,
				limit,
				orderBy,
			});

			const data = result.map(mapCategory);

			return { total, page: currentPage, limit, data };
		});
	}

	async findOne(id: Id) {
		const result = await this.db.query.categories.findFirst({
			where: { id },
		});
		return mapCategory(result);
	}

	async create(data: CreateCategory) {
		const [result] = await this.db.insert(schema.categories).values(data).returning();
		return mapCategory(result);
	}

	async update(id: Id, updateCategory: UpdateCategory) {
		const [result] = await this.db
			.update(schema.categories)
			.set(updateCategory)
			.where(eq(schema.categories.id, id))
			.returning();
		return mapCategory(result);
	}

	async remove(id: Id) {
		const [result] = await this.db
			.delete(schema.categories)
			.where(eq(schema.categories.id, id))
			.returning();
		return mapCategory(result);
	}
}
