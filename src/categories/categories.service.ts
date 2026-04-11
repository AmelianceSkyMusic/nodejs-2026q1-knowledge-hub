import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Id } from 'src/_shared/common/schemas/id.schema';
import { ArticlesService } from 'src/articles/articles.service';
import { sort } from 'src/common/utils/sort.util';

import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesWithPaginationQueryDto } from './dto/get-categories-with-pagination-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './repositories/categories.repository';

import { ERROR } from 'src/_shared/common/constants/error';

@Injectable()
export class CategoriesService {
	constructor(
		private readonly articlesService: ArticlesService,
		private readonly categoriesRepository: CategoriesRepository,
	) {}

	findAll(getCategoriesWithPaginationQueryDto: GetCategoriesWithPaginationQueryDto) {
		const { page, limit, sortBy, order } = getCategoriesWithPaginationQueryDto;

		const allCategories = this.categoriesRepository.findAll();

		const sortedCategories = sort(allCategories, sortBy, order);
		if (!page) return sortedCategories;

		const offset = (page - 1) * limit;

		const paginatedData = sortedCategories.slice(offset, offset + limit);

		return {
			total: sortedCategories.length,
			page,
			limit,
			data: paginatedData,
		};
	}

	findOne(id: Id) {
		const category = this.categoriesRepository.findOne(id);
		if (!category) throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);

		return category;
	}

	create(createCategoryDto: CreateCategoryDto) {
		const newCategory = {
			...createCategoryDto,
			id: randomUUID(),
		};
		return this.categoriesRepository.create(newCategory);
	}

	update(id: Id, updateCategoryDto: UpdateCategoryDto) {
		const category = this.categoriesRepository.findOne(id);
		if (!category) throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);

		const updatedCategory = {
			...category,
			...updateCategoryDto,
		};

		const result = this.categoriesRepository.update(id, updatedCategory);
		if (!result) throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);

		return result;
	}

	remove(id: Id) {
		const isDeleted = this.categoriesRepository.remove(id);
		if (!isDeleted) throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);

		this.articlesService.nullifyCategory(id);

		return isDeleted;
	}
}
