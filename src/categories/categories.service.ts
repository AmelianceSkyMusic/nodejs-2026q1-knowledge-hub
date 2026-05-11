import { Injectable } from '@nestjs/common';
import { CreateCategory } from 'shared/categories/schemas/create-category.schema';
import { GetCategoriesWithPaginationQuery } from 'shared/categories/schemas/get-categories-with-pagination-query.schema';
import { UpdateCategory } from 'shared/categories/schemas/update-category.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';

import { CategoryMapper } from './mappers/category.mapper';
import { CategoriesRepository } from './repositories/categories.repository';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class CategoriesService {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async findAll(getCategoriesWithPaginationQuery: GetCategoriesWithPaginationQuery) {
		const result = await this.categoriesRepository.findAll(getCategoriesWithPaginationQuery);
		if ('data' in result) {
			return { ...result, data: CategoryMapper.toCategories(result.data) };
		}
		return CategoryMapper.toCategories(result);
	}

	async findOne(id: Id) {
		const result = await this.categoriesRepository.findOne(id);
		if (!result) throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
		return CategoryMapper.toCategory(result);
	}

	async create(createCategory: CreateCategory) {
		const result = await this.categoriesRepository.create(createCategory);
		if (!result) throw new InternalServerError(ERROR.CATEGORY.CREATE_FAILED);
		return CategoryMapper.toCategory(result);
	}

	async update(id: Id, createCategory: UpdateCategory) {
		const result = await this.categoriesRepository.update(id, createCategory);
		if (!result) throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
		return CategoryMapper.toCategory(result);
	}

	async remove(id: Id) {
		const result = await this.categoriesRepository.remove(id);
		if (!result) throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
		return CategoryMapper.toCategory(result);
	}
}
