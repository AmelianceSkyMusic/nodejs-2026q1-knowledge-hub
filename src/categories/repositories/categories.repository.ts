import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Id } from 'shared/common/schemas/id.schema';
import { InjectDrizzle } from 'src/drizzle/decorators/drizzle.decorator';
import { DrizzleDb } from 'src/drizzle/types/drizzle-db';
import { calculatePagination } from 'src/drizzle/utils/calculate-pagination';

import * as schema from '../../drizzle/db/schema';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { GetCategoriesWithPaginationQueryDto } from '../dto/get-categories-with-pagination-query.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
	constructor(@InjectDrizzle() private readonly db: DrizzleDb) {}

	async findAll(getCategoriesWithPaginationQueryDto: GetCategoriesWithPaginationQueryDto) {
		const { page, limit, sortBy, order } = getCategoriesWithPaginationQueryDto;

		const orderBy = { [sortBy]: order };

		if (!page) return await this.db.query.categories.findMany({ orderBy });

		return await this.db.transaction(async (tx) => {
			const total = await tx.$count(schema.categories);
			if (total === 0) return { total, page, limit, data: [] };

			const { currentPage, offset } = calculatePagination(total, page, limit);

			const result = await tx.query.categories.findMany({
				offset,
				limit,
				orderBy,
			});

			return { total, page: currentPage, limit, data: result };
		});
	}

	async findOne(id: Id) {
		return await this.db.query.categories.findFirst({
			where: { id },
		});
	}

	async create(createCategoryDto: CreateCategoryDto) {
		const [result] = await this.db
			.insert(schema.categories)
			.values(createCategoryDto)
			.returning();
		return result;
	}

	async update(id: Id, updateCategoryDto: UpdateCategoryDto) {
		const [result] = await this.db
			.update(schema.categories)
			.set(updateCategoryDto)
			.where(eq(schema.categories.id, id))
			.returning();
		return result;
	}

	async remove(id: Id) {
		const [result] = await this.db
			.delete(schema.categories)
			.where(eq(schema.categories.id, id))
			.returning();
		return result;
	}
}
