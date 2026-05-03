import { Test } from '@nestjs/testing';
import { BadRequestError } from 'src/common/errors/bad-request.error';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
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
		status: MOCKED_ARTICLE_STATUS,
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

	describe('findAll', () => {
		it('should call .findAll() with arguments and return a result', async () => {
			const query = {} as GetArticlesWithPaginationQueryDto;
			mockArticlesRepository.findAll.mockResolvedValue(articles);

			const result = await service.findAll(query);

			expect(result).toEqual(articles);
			expect(mockArticlesRepository.findAll).toHaveBeenCalledWith(query);
		});
	});

	describe('findOne', () => {
		it('should call .findOne() with arguments and return a result', async () => {
			mockArticlesRepository.findOne.mockResolvedValue(article);

			const result = await service.findOne(article.id);

			expect(result).toEqual(article);
			expect(mockArticlesRepository.findOne).toHaveBeenCalledWith(article.id);
		});

		it('should call .findOne() and throw NotFoundError if not found', async () => {
			mockArticlesRepository.findOne.mockResolvedValue(null);

			await expect(service.findOne(article.id)).rejects.toThrow(NotFoundError);
		});
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

		it('should throw NotFoundError if category does not exist (foreign key violation)', async () => {
			mockArticlesRepository.create.mockRejectedValue({ code: PG_ERROR.FOREIGN_KEY_VIOLATION });

			await expect(service.create(createArticleDto, jwtUser)).rejects.toThrow(NotFoundError);
		});

		it('should throw InternalServerError if create returns null', async () => {
			mockArticlesRepository.create.mockResolvedValue(null);

			await expect(service.create(createArticleDto, jwtUser)).rejects.toThrow(
				InternalServerError,
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

		it('should throw ForbiddenError if user is not owner and not admin', async () => {
			mockArticlesRepository.findOne.mockResolvedValue({ ...article, authorId: 'another-id' });

			await expect(service.update(article.id, updateArticleDto, jwtUser)).rejects.toThrow(
				ForbiddenError,
			);
			expect(mockArticlesRepository.update).not.toHaveBeenCalled();
		});

		it('should throw NotFoundError if update returns null', async () => {
			mockArticlesRepository.findOne.mockResolvedValue(article);
			mockArticlesRepository.update.mockResolvedValue(null);

			const dtoWithoutStatusChange = { ...updateArticleDto, status: article.status };

			await expect(service.update(article.id, dtoWithoutStatusChange, jwtUser)).rejects.toThrow(
				NotFoundError,
			);
		});

		it('should allow valid status transition (draft -> published)', async () => {
			const draftArticle = { ...article, status: ARTICLE_STATUS.DRAFT };
			mockArticlesRepository.findOne.mockResolvedValue(draftArticle);
			mockArticlesRepository.update.mockResolvedValue(article);

			const updateDto = { status: ARTICLE_STATUS.PUBLISHED } as UpdateArticleDto;
			await service.update(article.id, updateDto, adminUser);

			expect(mockArticlesRepository.update).toHaveBeenCalledWith(article.id, updateDto);
		});

		it('should throw BadRequestError for invalid status transition (archived -> draft)', async () => {
			const archivedArticle = { ...article, status: ARTICLE_STATUS.ARCHIVED };
			mockArticlesRepository.findOne.mockResolvedValue(archivedArticle);

			const updateDto = { status: ARTICLE_STATUS.DRAFT } as UpdateArticleDto;

			await expect(service.update(article.id, updateDto, adminUser)).rejects.toThrow(
				BadRequestError,
			);
			expect(mockArticlesRepository.update).not.toHaveBeenCalled();
		});
	});

	describe('remove', () => {
		it('should call .remove() if user is owner', async () => {
			mockArticlesRepository.findOne.mockResolvedValue(article);
			mockArticlesRepository.remove.mockResolvedValue(article);

			const result = await service.remove(article.id, jwtUser);

			expect(result).toEqual(article);
			expect(mockArticlesRepository.remove).toHaveBeenCalledWith(article.id);
		});

		it('should throw ForbiddenError if user is not owner and not admin', async () => {
			mockArticlesRepository.findOne.mockResolvedValue({ ...article, authorId: 'other-id' });

			await expect(service.remove(article.id, jwtUser)).rejects.toThrow(ForbiddenError);
			expect(mockArticlesRepository.remove).not.toHaveBeenCalled();
		});

		it('should call .remove() if user is admin but not owner', async () => {
			mockArticlesRepository.findOne.mockResolvedValue({ ...article, authorId: 'other-id' });
			mockArticlesRepository.remove.mockResolvedValue(article);

			await service.remove(article.id, adminUser);

			expect(mockArticlesRepository.remove).toHaveBeenCalledWith(article.id);
		});

		it('should throw NotFoundError if not found', async () => {
			mockArticlesRepository.findOne.mockResolvedValue(article);
			mockArticlesRepository.remove.mockResolvedValue(null);

			await expect(service.remove(article.id, jwtUser)).rejects.toThrow(NotFoundError);
		});
	});
});
