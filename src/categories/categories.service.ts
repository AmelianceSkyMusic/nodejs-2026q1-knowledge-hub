import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { CreateCategory } from 'shared/categories/schemas/create-category.schema';
import { GetCategoriesWithPaginationQuery } from 'shared/categories/schemas/get-categories-with-pagination-query.schema';
import { UpdateCategory } from 'shared/categories/schemas/update-category.schema';
import { Id } from 'shared/common/schemas/id.schema';

import { CategoriesRepository } from './repositories/categories.repository';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class CategoriesService {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async findAll(getCategoriesWithPaginationQuery: GetCategoriesWithPaginationQuery) {
		return await this.categoriesRepository.findAll(getCategoriesWithPaginationQuery);
	}

	async findOne(id: Id) {
		const result = await this.categoriesRepository.findOne(id);
		if (!result) throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);
		return result;
	}

	async create(createCategory: CreateCategory) {
		try {
			return await this.categoriesRepository.create(createCategory);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') throw new ConflictException(ERROR.ARTICLE.ALREADY_EXISTS);
			}
			throw error;
		}
	}

	async update(id: Id, updateCategory: UpdateCategory) {
		try {
			return await this.categoriesRepository.update(id, updateCategory);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);
			}
			throw error;
		}
	}

	async remove(id: Id) {
		try {
			return await this.categoriesRepository.remove(id);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);
			}
			throw error;
		}
	}
}
