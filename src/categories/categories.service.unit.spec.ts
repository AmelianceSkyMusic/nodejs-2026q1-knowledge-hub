import { Test } from '@nestjs/testing';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';

import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './repositories/categories.repository';

import { MOCK } from 'src/common/constants/mock';

import type { TestingModule } from '@nestjs/testing';

import type { CreateCategoryDto } from './dto/create-category.dto';
import type { GetCategoriesWithPaginationQueryDto } from './dto/get-categories-with-pagination-query.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
	let service: CategoriesService;

	const MOCKED_CATEGORY_ID = MOCK.COMMON.ID;
	const MOCKED_CATEGORY_NAME = MOCK.CATEGORY.NAME;
	const MOCKED_CATEGORY_DESCRIPTION = MOCK.CATEGORY.DESCRIPTION;

	const category = {
		id: MOCKED_CATEGORY_ID,
		name: MOCKED_CATEGORY_NAME,
	};
	const categories = [category];

	const createCategoryDto: CreateCategoryDto = {
		description: MOCKED_CATEGORY_DESCRIPTION,
		name: MOCKED_CATEGORY_NAME,
	};

	const updateCategoryDto: UpdateCategoryDto = createCategoryDto;

	const mockCategoriesRepository = {
		findAll: vi.fn(),
		findOne: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		remove: vi.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CategoriesService,
				{
					provide: CategoriesRepository,
					useValue: mockCategoriesRepository,
				},
			],
		}).compile();

		service = module.get<CategoriesService>(CategoriesService);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findAll', () => {
		it('should call .findAll() with arguments and return a result', async () => {
			const query = {} as GetCategoriesWithPaginationQueryDto;

			mockCategoriesRepository.findAll.mockResolvedValue(categories);

			const result = await service.findAll(query);

			expect(result).toEqual(categories);
			expect(mockCategoriesRepository.findAll).toHaveBeenCalledWith(query);
			expect(mockCategoriesRepository.findAll).toHaveBeenCalledTimes(1);
		});
	});

	describe('findOne', () => {
		it('should call .findOne() with arguments and return a result', async () => {
			mockCategoriesRepository.findOne.mockResolvedValue(category);

			const result = await service.findOne(category.id);

			expect(result).toEqual(category);
			expect(mockCategoriesRepository.findOne).toHaveBeenCalledWith(category.id);
			expect(mockCategoriesRepository.findOne).toHaveBeenCalledTimes(1);
		});

		it('should call .findOne() and throw NotFoundError() if not found', async () => {
			mockCategoriesRepository.findOne.mockResolvedValue(null);

			await expect(service.findOne(category.id)).rejects.toThrow(NotFoundError);
		});
	});

	describe('create', () => {
		it('should call .create() with arguments and return a result', async () => {
			mockCategoriesRepository.create.mockResolvedValue(category);

			const result = await service.create(createCategoryDto);

			expect(result).toEqual(category);
			expect(mockCategoriesRepository.create).toHaveBeenCalledWith(createCategoryDto);
			expect(mockCategoriesRepository.create).toHaveBeenCalledTimes(1);
		});

		it('should call .create() and throw InternalServerError() if failed', async () => {
			mockCategoriesRepository.create.mockResolvedValue(null);

			await expect(service.create(createCategoryDto)).rejects.toThrow(InternalServerError);
		});
	});

	describe('update', () => {
		it('should call .update() with arguments and return a result', async () => {
			mockCategoriesRepository.update.mockResolvedValue(category);

			const result = await service.update(category.id, updateCategoryDto);

			expect(result).toEqual(category);
			expect(mockCategoriesRepository.update).toHaveBeenCalledWith(
				category.id,
				updateCategoryDto,
			);
			expect(mockCategoriesRepository.update).toHaveBeenCalledTimes(1);
		});

		it('should call .update() and throw NotFoundError if category not found', async () => {
			mockCategoriesRepository.update.mockResolvedValue(null);

			await expect(service.update(category.id, updateCategoryDto)).rejects.toThrow(
				NotFoundError,
			);
		});
	});

	describe('remove', () => {
		it('should call .remove() with arguments and return a result', async () => {
			mockCategoriesRepository.remove.mockResolvedValue(category);

			const result = await service.remove(category.id);

			expect(result).toEqual(category);
			expect(mockCategoriesRepository.remove).toHaveBeenCalledWith(category.id);
			expect(mockCategoriesRepository.remove).toHaveBeenCalledTimes(1);
		});

		it('should call .remove() and throw NotFoundError() if category not found', async () => {
			mockCategoriesRepository.remove.mockResolvedValue(null);

			await expect(service.remove(category.id)).rejects.toThrow(NotFoundError);
		});
	});
});
