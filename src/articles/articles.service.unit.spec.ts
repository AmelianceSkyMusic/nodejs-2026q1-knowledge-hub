import {
	ForbiddenException,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PG_ERROR } from 'src/common/utils/pg-error';

import { ArticlesService } from './articles.service';
import { ArticlesRepository } from './repositories/articles.repository';

import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';
import { USER_ROLES } from 'shared/users/constants/user-role';
import { MOCK } from 'src/common/constants/mock';

import type { TestingModule } from '@nestjs/testing';
import type { JwtUser } from 'shared/auth/schemas/jwt-user.schema';

import type { CreateArticleDto } from './dto/create-article.dto';
import type { GetArticlesWithPaginationQueryDto } from './dto/get-articles-with-pagination.query.dto';
import type { UpdateArticleDto } from './dto/update-article.dto';

describe('ArticlesService', () => {
	let service: ArticlesService;

	const MOCKED_ARTICLE_ID = MOCK.COMMON.ID;
	const MOCKED_ARTICLE_STATUS = ARTICLE_STATUS.DRAFT;
	const MOCKED_CATEGORY_ID = MOCK.COMMON.ID;
	const MOCKED_CONTENT = MOCK.ARTICLE.CONTENT;
	const MOCKED_LOGIN = MOCK.USER.LOGIN;
	const MOCKED_TAGS = [...MOCK.ARTICLE.TAGS];
	const MOCKED_TITLE = MOCK.ARTICLE.TITLE;
	const MOCKED_USER_ID = MOCK.COMMON.ID;

	const article = {
		id: MOCKED_ARTICLE_ID,
		title: MOCKED_TITLE,
		authorId: MOCKED_USER_ID,
	};
	const articles = [article];

	const jwtUser: JwtUser = {
		userId: MOCKED_USER_ID,
		role: USER_ROLES.VIEWER,
		login: MOCKED_LOGIN,
	};

	const adminUser: JwtUser = {
		...jwtUser,
		role: USER_ROLES.ADMIN,
	};

	const createArticleDto: CreateArticleDto = {
		authorId: MOCKED_USER_ID,
		status: MOCKED_ARTICLE_STATUS,
		tags: MOCKED_TAGS,
		title: MOCKED_TITLE,
		content: MOCKED_CONTENT,
		categoryId: MOCKED_CATEGORY_ID,
	};

	const { authorId, ...createArticleDtoWithoutAuthor } = createArticleDto;

	const updateArticleDto: UpdateArticleDto = {
		...createArticleDtoWithoutAuthor,
	};

	const mockArticlesRepository = {
		findAll: vi.fn(),
		findOne: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		remove: vi.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ArticlesService,
				{
					provide: ArticlesRepository,
					useValue: mockArticlesRepository,
				},
			],
		}).compile();

		service = module.get<ArticlesService>(ArticlesService);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should call .findAll() with arguments and return a result', async () => {
		const query = {} as GetArticlesWithPaginationQueryDto;
		mockArticlesRepository.findAll.mockResolvedValue(articles);

		const result = await service.findAll(query);

		expect(result).toEqual(articles);
		expect(mockArticlesRepository.findAll).toHaveBeenCalledWith(query);
	});

	it('should call .findOne() with arguments and return a result', async () => {
		mockArticlesRepository.findOne.mockResolvedValue(article);

		const result = await service.findOne(article.id);

		expect(result).toEqual(article);
		expect(mockArticlesRepository.findOne).toHaveBeenCalledWith(article.id);
	});

	it('should call .findOne() and throw NotFoundException if not found', async () => {
		mockArticlesRepository.findOne.mockResolvedValue(null);

		await expect(service.findOne(article.id)).rejects.toThrow(NotFoundException);
	});

	describe('create', () => {
		it('should call .create() with authorId from user and return a result', async () => {
			mockArticlesRepository.create.mockResolvedValue(article);

			const result = await service.create(createArticleDto, jwtUser);

			expect(result).toEqual(article);

			expect(mockArticlesRepository.create).toHaveBeenCalledWith({
				...createArticleDto,
				authorId: jwtUser.userId,
			});
		});

		it('should throw NotFoundException() if category does not exist (FK violation)', async () => {
			mockArticlesRepository.create.mockRejectedValue({ code: PG_ERROR.FOREIGN_KEY_VIOLATION });

			await expect(service.create(createArticleDto, jwtUser)).rejects.toThrow(NotFoundException);
		});

		it('should throw InternalServerErrorException() if create returns null', async () => {
			mockArticlesRepository.create.mockResolvedValue(null);

			await expect(service.create(createArticleDto, jwtUser)).rejects.toThrow(
				InternalServerErrorException,
			);
		});
	});

	describe('update', () => {
		it('should call .update() for owner and return a result', async () => {
			mockArticlesRepository.findOne.mockResolvedValue(article);
			mockArticlesRepository.update.mockResolvedValue(article);

			const result = await service.update(article.id, updateArticleDto, jwtUser);

			expect(result).toEqual(article);
			expect(mockArticlesRepository.update).toHaveBeenCalledWith(article.id, updateArticleDto);
		});

		it('should call .update() for admin and return a result', async () => {
			mockArticlesRepository.findOne.mockResolvedValue({ ...article, authorId: 'another-id' });
			mockArticlesRepository.update.mockResolvedValue(article);

			const result = await service.update(article.id, updateArticleDto, adminUser);

			expect(result).toEqual(article);
		});

		it('should throw ForbiddenException() if user is not owner and not admin', async () => {
			mockArticlesRepository.findOne.mockResolvedValue({ ...article, authorId: 'another-id' });

			await expect(service.update(article.id, updateArticleDto, jwtUser)).rejects.toThrow(
				ForbiddenException,
			);
			expect(mockArticlesRepository.update).not.toHaveBeenCalled();
		});

		it('should throw NotFoundException() if update returns null', async () => {
			mockArticlesRepository.findOne.mockResolvedValue(article);
			mockArticlesRepository.update.mockResolvedValue(null);

			await expect(service.update(article.id, updateArticleDto, jwtUser)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	it('should call .remove() with arguments and return a result', async () => {
		mockArticlesRepository.remove.mockResolvedValue(article);

		const result = await service.remove(article.id);

		expect(result).toEqual(article);
		expect(mockArticlesRepository.remove).toHaveBeenCalledWith(article.id);
	});

	it('should call .remove() and throw NotFoundException() if not found', async () => {
		mockArticlesRepository.remove.mockResolvedValue(null);

		await expect(service.remove(article.id)).rejects.toThrow(NotFoundException);
	});
});
