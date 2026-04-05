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
	Query,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	getSchemaPath,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { Id } from 'src/common/types/id';

import { CategoriesService } from './categories.service';
import { CreateCategoryRequestDto } from './dto/request/create-category.request.dto';
import { GetCategoriesWithPaginationQueryRequestDto } from './dto/request/get-categories-with-pagination-query.request.dto';
import { UpdateCategoryRequestDto } from './dto/request/update-category.request.dto';
import { CategoriesWithPaginationResponseDto } from './dto/response/categories-with-pagination.response.dto';
import { CategoryResponseDto } from './dto/response/category.response.dto';

import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	@ApiOperation({
		summary: 'Get all categories',
		description: 'Gets all categories.',
	})
	@ApiOkResponse({ description: 'Successful operation', type: [CategoryResponseDto] })
	@ApiOkResponse({
		description: 'Successful operation',
		schema: {
			oneOf: [
				{ $ref: getSchemaPath(CategoryResponseDto), type: 'array' },
				{ $ref: getSchemaPath(CategoriesWithPaginationResponseDto) },
			],
		},
	})
	@HttpCode(HttpStatus.OK)
	findAll(
		@Query()
		getCategoriesWithPaginationQueryRequestDto: GetCategoriesWithPaginationQueryRequestDto,
	) {
		const result = this.categoriesService.findAll(getCategoriesWithPaginationQueryRequestDto);
		if ('data' in result) {
			return plainToInstance(CategoriesWithPaginationResponseDto, result, {
				excludeExtraneousValues: true,
			});
		}
		return plainToInstance(CategoryResponseDto, result, {
			excludeExtraneousValues: true,
		});
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Get single category by id',
		description: 'Gets single category by id',
	})
	@ApiOkResponse({ description: 'Successful operation', type: CategoryResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. CategoryId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Category was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Category id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@Serialize(CategoryResponseDto)
	findOne(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.categoriesService.findOne(id);
	}

	@Post()
	@ApiOperation({
		summary: 'Add new category',
		description: 'Add new category (admin only)',
	})
	@ApiCreatedResponse({ description: 'Category is created', type: CategoryResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. Body does not contain required fields' })
	@HttpCode(HttpStatus.CREATED)
	@Serialize(CategoryResponseDto)
	create(@Body() createCategoryRequestDto: CreateCategoryRequestDto) {
		return this.categoriesService.create(createCategoryRequestDto);
	}

	@Put(':id')
	@ApiOperation({
		summary: 'Update category information',
		description: 'Update category information by UUID (admin only)',
	})
	@ApiOkResponse({ description: 'The category has been updated', type: CategoryResponseDto })
	@ApiBadRequestResponse({ description: 'Bad request. CategoryId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Category was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Category id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@Serialize(CategoryResponseDto)
	update(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
		@Body() updateCategoryRequestDto: UpdateCategoryRequestDto,
	) {
		return this.categoriesService.update(id, updateCategoryRequestDto);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete category',
		description: 'Delete category. Sets categoryId to null on associated articles.',
	})
	@ApiNoContentResponse({ description: 'Deleted successfully' })
	@ApiBadRequestResponse({ description: 'Bad request. CategoryId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Category was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Category id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(
		@Param('id', new ParseUUIDPipe({ version: '4', errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
		id: Id,
	) {
		return this.categoriesService.remove(id);
	}
}
