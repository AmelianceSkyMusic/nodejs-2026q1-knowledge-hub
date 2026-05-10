import { Test } from '@nestjs/testing';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { UnprocessableEntityError } from 'src/common/errors/unprocessable-entity.error';
import { PG_ERROR } from 'src/common/utils/pg-error';

import { CommentsService } from './comments.service';
import { CommentsRepository } from './repositories/comments.repository';

import { USER_ROLES } from 'shared/users/constants/user-role';
import { MOCK } from 'src/common/constants/mock';

import type { TestingModule } from '@nestjs/testing';
import type { JwtUserDto } from 'src/auth/dto/jwt-user.dto';

import type { CreateCommentDto } from './dto/create-comment.dto';
import type { GetCommentsWithPaginationQueryDto } from './dto/get-comment-with-pagination-query.dto';

describe('CommentsService', () => {
	let service: CommentsService;

	const MOCKED_ARTICLE_ID = MOCK.COMMON.ID;
	const MOCKED_COMMENT_ID = MOCK.COMMON.ID;
	const MOCKED_CONTENT = MOCK.COMMENT.CONTENT;
	const MOCKED_LOGIN = MOCK.USER.LOGIN;
	const MOCKED_USER_ID = MOCK.COMMON.ID;

	const comment = {
		id: MOCKED_COMMENT_ID,
		content: MOCKED_CONTENT,
		authorId: MOCKED_USER_ID,
		articleId: MOCKED_ARTICLE_ID,
		createdAt: new Date(),
	};

	const expectedComment = {
		...comment,
		createdAt: comment.createdAt.getTime(),
	};

	const comments = [comment];
	const expectedComments = [expectedComment];

	const jwtUser: JwtUserDto = {
		userId: MOCKED_USER_ID,
		role: USER_ROLES.VIEWER,
		login: MOCKED_LOGIN,
	};

	const adminUser: JwtUserDto = {
		...jwtUser,
		role: USER_ROLES.ADMIN,
	};

	const createCommentDto: CreateCommentDto = {
		authorId: MOCKED_USER_ID,
		content: MOCKED_CONTENT,
		articleId: MOCKED_ARTICLE_ID,
	};

	const mockCommentsRepository = {
		findAll: vi.fn(),
		findOne: vi.fn(),
		create: vi.fn(),
		remove: vi.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CommentsService,
				{
					provide: CommentsRepository,
					useValue: mockCommentsRepository,
				},
			],
		}).compile();

		service = module.get<CommentsService>(CommentsService);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findAllForArticle', () => {
		it('should call .findAllForArticle() with arguments and return a result', async () => {
			const query = {
				articleId: MOCKED_ARTICLE_ID,
			} as GetCommentsWithPaginationQueryDto;
			mockCommentsRepository.findAll.mockResolvedValue(comments);

			const result = await service.findAllForArticle(query);

			expect(result).toEqual(expectedComments);
			expect(mockCommentsRepository.findAll).toHaveBeenCalledWith(query);
		});
	});

	describe('findById', () => {
		it('should call .findById() with arguments and return a result', async () => {
			mockCommentsRepository.findOne.mockResolvedValue(comment);

			const result = await service.findById(comment.id);

			expect(result).toEqual(expectedComment);
			expect(mockCommentsRepository.findOne).toHaveBeenCalledWith(comment.id);
		});

		it('should call .findById() and throw NotFoundError() if not found', async () => {
			mockCommentsRepository.findOne.mockResolvedValue(null);

			await expect(service.findById(comment.id)).rejects.toThrow(NotFoundError);
		});
	});

	describe('create', () => {
		it('should call .create() with authorId from user and return a result', async () => {
			mockCommentsRepository.create.mockResolvedValue(comment);

			const result = await service.create(createCommentDto, jwtUser);

			expect(result).toEqual(expectedComment);
			expect(mockCommentsRepository.create).toHaveBeenCalledWith({
				...createCommentDto,
				authorId: jwtUser.userId,
			});
		});

		it('should throw UnprocessableEntity() if article does not exist (foreign key violation)', async () => {
			mockCommentsRepository.create.mockRejectedValue({ code: PG_ERROR.FOREIGN_KEY_VIOLATION });

			await expect(service.create(createCommentDto, jwtUser)).rejects.toThrow(
				UnprocessableEntityError,
			);
		});

		it('should throw InternalServerError() if create returns null', async () => {
			mockCommentsRepository.create.mockResolvedValue(null);

			await expect(service.create(createCommentDto, jwtUser)).rejects.toThrow(
				InternalServerError,
			);
		});
	});

	describe('remove', () => {
		it('should call .remove() for owner and return a result', async () => {
			mockCommentsRepository.findOne.mockResolvedValue(comment);
			mockCommentsRepository.remove.mockResolvedValue(comment);

			const result = await service.remove(comment.id, jwtUser);

			expect(result).toEqual(expectedComment);

			expect(mockCommentsRepository.findOne).toHaveBeenCalledWith(comment.id);
			expect(mockCommentsRepository.remove).toHaveBeenCalledWith(comment.id);
		});

		it('should call .remove() for admin without ownership check', async () => {
			mockCommentsRepository.remove.mockResolvedValue(comment);

			const result = await service.remove(comment.id, adminUser);

			expect(result).toEqual(expectedComment);

			expect(mockCommentsRepository.findOne).not.toHaveBeenCalled();
			expect(mockCommentsRepository.remove).toHaveBeenCalledWith(comment.id);
		});

		it('should throw ForbiddenError() if user is not owner and not admin', async () => {
			mockCommentsRepository.findOne.mockResolvedValue({ ...comment, authorId: 'other' });

			await expect(service.remove(comment.id, jwtUser)).rejects.toThrow(ForbiddenError);
			expect(mockCommentsRepository.remove).not.toHaveBeenCalled();
		});

		it('should throw NotFoundError() if remove returns null', async () => {
			mockCommentsRepository.remove.mockResolvedValue(null);

			await expect(service.remove(comment.id, adminUser)).rejects.toThrow(NotFoundError);
		});
	});
});
