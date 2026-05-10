import { Injectable } from '@nestjs/common';
import { Id } from 'shared/common/schemas/id.schema';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';

import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesWithPaginationQueryDto } from './dto/get-categories-with-pagination-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryMapper } from './mappers/category.mapper';
import { CategoriesRepository } from './repositories/categories.repository';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class CategoriesService {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async findAll(getCategoriesWithPaginationQueryDto: GetCategoriesWithPaginationQueryDto) {
		const result = await this.categoriesRepository.findAll(getCategoriesWithPaginationQueryDto);
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

	async create(createCategoryDto: CreateCategoryDto) {
		const result = await this.categoriesRepository.create(createCategoryDto);
		if (!result) throw new InternalServerError(ERROR.CATEGORY.CREATE_FAILED);
		return CategoryMapper.toCategory(result);
	}

	async update(id: Id, createCategoryDto: UpdateCategoryDto) {
		const result = await this.categoriesRepository.update(id, createCategoryDto);
		if (!result) throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
		return CategoryMapper.toCategory(result);
	}

	async remove(id: Id) {
		const result = await this.categoriesRepository.remove(id);
		if (!result) throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
		return CategoryMapper.toCategory(result);
	}
}
