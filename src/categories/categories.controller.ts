import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
} from '@nestjs/common';
import { Id } from 'src/common/types/id';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	findAll() {
		return this.categoriesService.findAll();
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	findOne(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.categoriesService.findOne(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoriesService.create(createCategoryDto);
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	update(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		return this.categoriesService.update(id, updateCategoryDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.categoriesService.remove(id);
	}
}
