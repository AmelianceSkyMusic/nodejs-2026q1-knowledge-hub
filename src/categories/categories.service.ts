import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ArticlesService } from 'src/articles/articles.service';
import { Id } from 'src/common/types/id';

import { CreateCategoryRequestDto } from './dto/request/create-category.request.dto';
import { UpdateCategoryRequestDto } from './dto/request/update-category.request.dto';
import { CategoriesRepository } from './repositories/categories.repository';

import { ERROR } from 'src/common/constants/error';

@Injectable()
export class CategoriesService {
	constructor(
		private readonly articlesService: ArticlesService,
		private readonly categoriesRepository: CategoriesRepository,
	) {}

	findAll() {
		return this.categoriesRepository.findAll();
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
