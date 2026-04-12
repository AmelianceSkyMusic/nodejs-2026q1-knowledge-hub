import { Injectable } from '@nestjs/common';
import { CreateCategory } from 'src/_shared/categories/schemas/create-category.schema';
import { GetCategoriesWithPaginationQuery } from 'src/_shared/categories/schemas/get-categories-with-pagination-query.schema';
import { UpdateCategory } from 'src/_shared/categories/schemas/update-category.schema';
import { Id } from 'src/_shared/common/schemas/id.schema';
import { PrismaService } from 'src/prisma/prisma.service';

import { mapCategory } from '../mapper/categories.mapper';

@Injectable()
export class CategoriesRepository {
	constructor(private prisma: PrismaService) {}

	async findAll(getCategoriesWithPaginationQuery: GetCategoriesWithPaginationQuery) {
		const { page, limit, sortBy, order } = getCategoriesWithPaginationQuery;

		if (!page) {
			const result = await this.prisma.category.findMany({ orderBy: { [sortBy]: order } });
			return result.map(mapCategory);
		}

		return await this.prisma.$transaction(async (tx) => {
			const total = await tx.category.count();
			if (total === 0) return { total, page, limit, data: [] };

			const pages = Math.ceil(total / limit) || 1;
			const currentPage = Math.min(Math.max(1, page), pages);
			const offset = (currentPage - 1) * limit;

			const result = await tx.category.findMany({
				skip: offset,
				take: limit,
				orderBy: { [sortBy]: order },
			});

			const data = result.map(mapCategory);

			return { total, page: currentPage, limit, data };
		});
	}

	async findOne(id: Id) {
		const result = await this.prisma.category.findUnique({ where: { id } });
		if (!result) return null;
		return mapCategory(result);
	}

	async create(data: CreateCategory) {
		const result = await this.prisma.category.create({ data });
		return mapCategory(result);
	}

	async update(id: Id, updateCategory: UpdateCategory) {
		const result = await this.prisma.category.update({ data: updateCategory, where: { id } });
		return mapCategory(result);
	}

	async remove(id: Id) {
		return await this.prisma.category.delete({ where: { id } });
	}
}
