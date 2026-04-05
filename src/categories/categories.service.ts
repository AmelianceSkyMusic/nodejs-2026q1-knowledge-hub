import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ArticlesService } from 'src/articles/articles.service';
import { Id } from 'src/common/types/id';
import { sort } from 'src/common/utils/sort.util';

import { CreateCategoryRequestDto } from './dto/request/create-category.request.dto';
import { GetCategoriesWithPaginationQueryRequestDto } from './dto/request/get-categories-with-pagination-query.request.dto';
import { UpdateCategoryRequestDto } from './dto/request/update-category.request.dto';
import { CategoriesRepository } from './repositories/categories.repository';

import { CATEGORY_SORT_BY } from './constants/category-sort-by';
import { ERROR } from 'src/common/constants/error';
import { ORDER } from 'src/common/constants/order';

@Injectable()
export class CategoriesService {
	constructor(
		private readonly articlesService: ArticlesService,
		private readonly categoriesRepository: CategoriesRepository,
	) {}

	findAll(getCategoriesWithPaginationQueryRequestDto: GetCategoriesWithPaginationQueryRequestDto) {
		const {
			page,
			limit = 10,
			sortBy = CATEGORY_SORT_BY.NAME,
			order = ORDER.ASC,
		} = getCategoriesWithPaginationQueryRequestDto;

		const allCategories = this.categoriesRepository.findAll();

		const sortedCategories = sort(allCategories, sortBy, order);
		if (!page) return sortedCategories;

		const offset = (page - 1) * limit;

		const paginatedData = sortedCategories.slice(offset, offset + limit);

		return {
			total: sortedCategories.length,
			page: Number(page),
			limit: Number(limit),
			data: paginatedData,
		};
	}

	findOne(id: Id) {
		const category = this.categoriesRepository.findOne(id);
		if (!category) throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);

		return category;
	}

	create(createCategoryRequestDto: CreateCategoryRequestDto) {
		const newCategory = {
			...createCategoryRequestDto,
			id: randomUUID(),
		};
		return this.categoriesRepository.create(newCategory);
	}

	update(id: Id, updateCategoryRequestDto: UpdateCategoryRequestDto) {
		const category = this.categoriesRepository.findOne(id);
		if (!category) throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);

		const updatedCategory = {
			...category,
			...updateCategoryRequestDto,
		};
		return this.categoriesRepository.update(id, updatedCategory);
	}

	remove(id: Id) {
		const isDeleted = this.categoriesRepository.remove(id);
		if (!isDeleted) throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);

		this.articlesService.nullifyCategory(id);

		return isDeleted;
	}
}
