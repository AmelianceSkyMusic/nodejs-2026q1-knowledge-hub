import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Id } from 'shared/common/schemas/id.schema';
import { NotFoundError } from 'src/common/errors/not-found.error';

import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesWithPaginationQueryDto } from './dto/get-categories-with-pagination-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './repositories/categories.repository';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class CategoriesService {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async findAll(getCategoriesWithPaginationQueryDto: GetCategoriesWithPaginationQueryDto) {
		return await this.categoriesRepository.findAll(getCategoriesWithPaginationQueryDto);
	}

	async findOne(id: Id) {
		const result = await this.categoriesRepository.findOne(id);
		if (!result) throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
		return result;
	}

	async create(createCategoryDto: CreateCategoryDto) {
		const result = await this.categoriesRepository.create(createCategoryDto);
		if (!result) throw new InternalServerErrorException(ERROR.CATEGORY.CREATE_FAILED);
		return result;
	}

	async update(id: Id, createCategoryDto: UpdateCategoryDto) {
		const result = await this.categoriesRepository.update(id, createCategoryDto);
		if (!result) throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
		return result;
	}

	async remove(id: Id) {
		const result = await this.categoriesRepository.remove(id);
		if (!result) throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
		return result;
	}
}
