import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiExtraModels,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	getSchemaPath,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';

import { CategoriesService } from './categories.service';
import { CategoriesWithPaginationDto } from './dto/categories-with-pagination.dto';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesWithPaginationQueryDto } from './dto/get-categories-with-pagination-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { USER_ROLES } from 'shared/users/constants/user-role';
import { SWAGGER } from 'src/common/constants/swagger';

@ApiTags('Category')
@ApiExtraModels(CategoriesWithPaginationDto)
@Controller('category')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	@Roles(USER_ROLES.EDITOR, USER_ROLES.VIEWER)
	@ApiOperation({ summary: 'Get all categories', description: 'Gets all categories' })
	@ApiOkResponse({
		description: 'Successful operation',
		schema: {
			oneOf: [
				{ $ref: getSchemaPath(CategoryDto), type: 'array' },
				{ $ref: getSchemaPath(CategoriesWithPaginationDto) },
			],
		},
	})
	@HttpCode(HttpStatus.OK)
	async findAll(
		@Query()
		getCategoriesWithPaginationQueryDto: GetCategoriesWithPaginationQueryDto,
	) {
		const result = await this.categoriesService.findAll(getCategoriesWithPaginationQueryDto);
		if ('data' in result) return CategoriesWithPaginationDto.create(result);
		return result.map((item) => CategoryDto.create(item));
	}

	@Get(':id')
	@Roles(USER_ROLES.EDITOR, USER_ROLES.VIEWER)
	@ApiOperation({
		summary: 'Get single category by id',
		description: 'Gets single category by id',
	})
	@ApiOkResponse({ description: 'Successful operation', type: CategoryDto })
	@ApiBadRequestResponse({ description: 'Bad request. CategoryId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Category was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Category id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: CategoryDto })
	async findOne(@Param() { id }: IdParamDto) {
		return await this.categoriesService.findOne(id);
	}

	@Post()
	@ApiOperation({
		summary: 'Add new category',
		description: 'Add new category (admin only)',
	})
	@ApiCreatedResponse({ description: 'Category is created', type: CategoryDto })
	@ApiBadRequestResponse({ description: 'Bad request. Body does not contain required fields' })
	@HttpCode(HttpStatus.CREATED)
	@ZodResponse({ type: CategoryDto })
	async create(@Body() createCategoryDto: CreateCategoryDto) {
		return await this.categoriesService.create(createCategoryDto);
	}

	@Put(':id')
	@ApiOperation({
		summary: 'Update category information',
		description: 'Update category information by UUID (admin only)',
	})
	@ApiOkResponse({ description: 'The category has been updated', type: CategoryDto })
	@ApiBadRequestResponse({ description: 'Bad request. CategoryId is invalid (not uuid)' })
	@ApiNotFoundResponse({ description: 'Category was not found' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'Category id',
		format: SWAGGER.FORMAT.ID,
	})
	@HttpCode(HttpStatus.OK)
	@ZodResponse({ type: CategoryDto })
	async update(@Param() { id }: IdParamDto, @Body() updateCategoryDto: UpdateCategoryDto) {
		return await this.categoriesService.update(id, updateCategoryDto);
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
	async remove(@Param() { id }: IdParamDto) {
		return await this.categoriesService.remove(id);
	}
}
