import {
	ForbiddenException,
	InternalServerErrorException,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
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
	};
	const comments = [comment];

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

			expect(result).toEqual(comments);
			expect(mockCommentsRepository.findAll).toHaveBeenCalledWith(query);
		});
	});

	describe('findById', () => {
		it('should call .findById() with arguments and return a result', async () => {
			mockCommentsRepository.findOne.mockResolvedValue(comment);

			const result = await service.findById(comment.id);

			expect(result).toEqual(comment);
			expect(mockCommentsRepository.findOne).toHaveBeenCalledWith(comment.id);
		});

		it('should call .findById() and throw NotFoundException() if not found', async () => {
			mockCommentsRepository.findOne.mockResolvedValue(null);

			await expect(service.findById(comment.id)).rejects.toThrow(NotFoundException);
		});
	});

	describe('create', () => {
		it('should call .create() with authorId from user and return a result', async () => {
			mockCommentsRepository.create.mockResolvedValue(comment);

			const result = await service.create(createCommentDto, jwtUser);

			expect(result).toEqual(comment);
			expect(mockCommentsRepository.create).toHaveBeenCalledWith({
				...createCommentDto,
				authorId: jwtUser.userId,
			});
		});

		it('should throw UnprocessableEntityException() if article does not exist (foreign key violation)', async () => {
			mockCommentsRepository.create.mockRejectedValue({ code: PG_ERROR.FOREIGN_KEY_VIOLATION });

			await expect(service.create(createCommentDto, jwtUser)).rejects.toThrow(
				UnprocessableEntityException,
			);
		});

		it('should throw InternalServerErrorException() if create returns null', async () => {
			mockCommentsRepository.create.mockResolvedValue(null);

			await expect(service.create(createCommentDto, jwtUser)).rejects.toThrow(
				InternalServerErrorException,
			);
		});
	});

	describe('remove', () => {
		it('should call .remove() for owner and return a result', async () => {
			mockCommentsRepository.findOne.mockResolvedValue(comment);
			mockCommentsRepository.remove.mockResolvedValue(comment);

			const result = await service.remove(comment.id, jwtUser);

			expect(result).toEqual(comment);

			expect(mockCommentsRepository.findOne).toHaveBeenCalledWith(comment.id);
			expect(mockCommentsRepository.remove).toHaveBeenCalledWith(comment.id);
		});

		it('should call .remove() for admin without ownership check', async () => {
			mockCommentsRepository.remove.mockResolvedValue(comment);

			const result = await service.remove(comment.id, adminUser);

			expect(result).toEqual(comment);

			expect(mockCommentsRepository.findOne).not.toHaveBeenCalled();
			expect(mockCommentsRepository.remove).toHaveBeenCalledWith(comment.id);
		});

		it('should throw ForbiddenException() if user is not owner and not admin', async () => {
			mockCommentsRepository.findOne.mockResolvedValue({ ...comment, authorId: 'other' });

			await expect(service.remove(comment.id, jwtUser)).rejects.toThrow(ForbiddenException);
			expect(mockCommentsRepository.remove).not.toHaveBeenCalled();
		});

		it('should throw NotFoundException() if remove returns null', async () => {
			mockCommentsRepository.remove.mockResolvedValue(null);

			await expect(service.remove(comment.id, adminUser)).rejects.toThrow(NotFoundException);
		});
	});
});
