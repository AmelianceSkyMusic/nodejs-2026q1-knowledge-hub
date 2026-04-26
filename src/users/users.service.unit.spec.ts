import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PG_ERROR } from 'src/common/utils/pg-error';

import { UsersRepository } from './repository/users.repository';
import { UsersService } from './users.service';

import { USER_DEFAULTS } from 'shared/users/constants/user-defaults';

import type { TestingModule } from '@nestjs/testing';
import type { UserEntity } from 'src/drizzle/db/schema';

import type { CreateUserDto } from './dto/create-user.dto';
import type { GetUsersWithPaginationQueryDto } from './dto/get-user-with-pagination-query.dto';
import type { UpdatePasswordDto } from './dto/update-password.dto';

const { compareMock } = vi.hoisted(() => ({
	compareMock: vi.fn().mockResolvedValue(true),
}));

vi.mock('bcrypt', () => ({
	hash: vi.fn().mockResolvedValue('hashed-password'),
	compare: compareMock,
}));

import { MOCK } from 'src/common/constants/mock';

describe('UsersService', () => {
	let service: UsersService;

	const MOCKED_HASHED_PASSWORD = MOCK.AUTH.HASHED_PASSWORD;
	const MOCKED_LOGIN = MOCK.USER.LOGIN;
	const MOCKED_PASSWORD = MOCK.AUTH.PASSWORD;
	const MOCKED_ROLE = MOCK.USER.ROLE;
	const MOCKED_USER_ID = MOCK.COMMON.ID;

	const user = {
		id: MOCKED_USER_ID,
		login: MOCKED_LOGIN,
		password: MOCKED_PASSWORD,
	} as UserEntity;

	const users = [user];

	const createUserDto: CreateUserDto = {
		login: MOCKED_LOGIN,
		password: MOCKED_PASSWORD,
		role: MOCKED_ROLE,
	};

	const createdUserWithHashedPassword = {
		...createUserDto,
		password: MOCKED_HASHED_PASSWORD,
	};

	const updatePassword: UpdatePasswordDto = {
		oldPassword: MOCKED_PASSWORD,
		newPassword: MOCKED_PASSWORD,
	};

	const updatePasswordArgs = [user.id, { password: MOCKED_HASHED_PASSWORD }];

	const mockUsersRepository = {
		findAll: vi.fn(),
		findOne: vi.fn(),
		findOneByLoginWithPassword: vi.fn(),
		create: vi.fn(),
		findWithPassword: vi.fn(),
		update: vi.fn(),
		remove: vi.fn(),
		createWithSignup: vi.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: UsersRepository,
					useValue: mockUsersRepository,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		compareMock.mockResolvedValue(true);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should call .findAll() with arguments and return a result', async () => {
		const query: GetUsersWithPaginationQueryDto = {
			limit: USER_DEFAULTS.LIMIT,
			sortBy: USER_DEFAULTS.SORT_BY,
			order: USER_DEFAULTS.ORDER,
		};

		mockUsersRepository.findAll.mockResolvedValue(users);

		const result = await service.findAll(query);

		expect(result).toEqual(users);

		expect(mockUsersRepository.findAll).toHaveBeenCalled();
		expect(mockUsersRepository.findAll).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findAll).toHaveBeenCalledWith(query);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .findOne() with arguments and return a result', async () => {
		mockUsersRepository.findOne.mockResolvedValue(user);

		const result = await service.findOne(user.id);

		expect(result).toEqual(user);

		expect(mockUsersRepository.findOne).toHaveBeenCalled();
		expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findOne).toHaveBeenCalledWith(user.id);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .findOne() with arguments and throw NotFoundException()', async () => {
		mockUsersRepository.findOne.mockResolvedValue(null);

		await expect(service.findOne(user.id)).rejects.toThrow(NotFoundException);

		expect(mockUsersRepository.findOne).toHaveBeenCalled();
		expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findOne).toHaveBeenCalledWith(user.id);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .findOneByLoginWithPassword() with arguments and return a result', async () => {
		mockUsersRepository.findOneByLoginWithPassword.mockResolvedValue(user);

		const result = await service.findOneByLoginWithPassword(user.login);

		expect(result).toEqual(user);

		expect(mockUsersRepository.findOneByLoginWithPassword).toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findOneByLoginWithPassword).toHaveBeenCalledWith(user.login);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
	});

	it('should call .create() with arguments and return a result', async () => {
		mockUsersRepository.create.mockResolvedValue(user);

		const result = await service.create(createUserDto);

		expect(result).toEqual(user);

		expect(mockUsersRepository.create).toHaveBeenCalled();
		expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.create).toHaveBeenCalledWith(createdUserWithHashedPassword);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .create() with arguments and throw InternalServerErrorException()', async () => {
		mockUsersRepository.create.mockResolvedValue(null);

		await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);

		expect(mockUsersRepository.create).toHaveBeenCalled();
		expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.create).toHaveBeenCalledWith(createdUserWithHashedPassword);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .create() with arguments and throw ConflictException() if user already exists', async () => {
		mockUsersRepository.create.mockRejectedValue({ code: PG_ERROR.UNIQUE_VIOLATION });

		await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);

		expect(mockUsersRepository.create).toHaveBeenCalled();
		expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.create).toHaveBeenCalledWith(createdUserWithHashedPassword);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .updatePassword() with arguments and return a result', async () => {
		mockUsersRepository.findWithPassword.mockResolvedValue(user);
		mockUsersRepository.update.mockResolvedValue(user);

		const result = await service.updatePassword(user.id, updatePassword);

		expect(result).toEqual(user);

		expect(mockUsersRepository.findWithPassword).toHaveBeenCalled();
		expect(mockUsersRepository.findWithPassword).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findWithPassword).toHaveBeenCalledWith(user.id);

		expect(mockUsersRepository.update).toHaveBeenCalled();
		expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.update).toHaveBeenCalledWith(...updatePasswordArgs);

		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .updatePassword() with non existent user and throw NotFoundException()', async () => {
		mockUsersRepository.findWithPassword.mockResolvedValue(null);

		await expect(service.updatePassword(user.id, updatePassword)).rejects.toThrow(
			NotFoundException,
		);

		expect(mockUsersRepository.findWithPassword).toHaveBeenCalled();
		expect(mockUsersRepository.findWithPassword).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findWithPassword).toHaveBeenCalledWith(user.id);

		expect(mockUsersRepository.update).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .updatePassword() with wrong old password and throw ForbiddenException()', async () => {
		mockUsersRepository.findWithPassword.mockResolvedValue(user);
		compareMock.mockResolvedValue(false);

		await expect(service.updatePassword(user.id, updatePassword)).rejects.toThrow(
			ForbiddenException,
		);

		expect(mockUsersRepository.findWithPassword).toHaveBeenCalled();
		expect(mockUsersRepository.findWithPassword).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findWithPassword).toHaveBeenCalledWith(user.id);

		expect(mockUsersRepository.update).not.toHaveBeenCalled();
	});

	it('should call .updatePassword() with update returns null and throw NotFoundException()', async () => {
		mockUsersRepository.findWithPassword.mockResolvedValue(user);
		mockUsersRepository.update.mockResolvedValue(null);

		await expect(service.updatePassword(user.id, updatePassword)).rejects.toThrow(
			NotFoundException,
		);

		expect(mockUsersRepository.findWithPassword).toHaveBeenCalled();
		expect(mockUsersRepository.findWithPassword).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findWithPassword).toHaveBeenCalledWith(user.id);

		expect(mockUsersRepository.update).toHaveBeenCalled();
		expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.update).toHaveBeenCalledWith(...updatePasswordArgs);

		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .remove() with arguments and return a result', async () => {
		mockUsersRepository.remove.mockResolvedValue(user);

		const result = await service.remove(user.id);

		expect(result).toEqual(user);

		expect(mockUsersRepository.remove).toHaveBeenCalled();
		expect(mockUsersRepository.remove).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.remove).toHaveBeenCalledWith(user.id);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .remove() and throw NotFoundException() if user not found', async () => {
		mockUsersRepository.remove.mockResolvedValue(null);

		await expect(service.remove(user.id)).rejects.toThrow(NotFoundException);

		expect(mockUsersRepository.remove).toHaveBeenCalled();
		expect(mockUsersRepository.remove).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.remove).toHaveBeenCalledWith(user.id);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .createWithSignup() with arguments and return a result', async () => {
		mockUsersRepository.create.mockResolvedValue(user);

		const result = await service.createWithSignup(createUserDto);

		expect(result).toEqual(user);

		expect(mockUsersRepository.create).toHaveBeenCalled();
		expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.create).toHaveBeenCalledWith(createdUserWithHashedPassword);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .createWithSignup() with arguments and throw InternalServerErrorException()', async () => {
		mockUsersRepository.create.mockResolvedValue(null);

		await expect(service.createWithSignup(createUserDto)).rejects.toThrow(
			InternalServerErrorException,
		);

		expect(mockUsersRepository.create).toHaveBeenCalled();
		expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.create).toHaveBeenCalledWith(createdUserWithHashedPassword);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});

	it('should call .createWithSignup() with arguments and throw BadRequestException() if user already exists', async () => {
		mockUsersRepository.create.mockRejectedValue({ code: PG_ERROR.UNIQUE_VIOLATION });

		await expect(service.createWithSignup(createUserDto)).rejects.toThrow(BadRequestException);

		expect(mockUsersRepository.create).toHaveBeenCalled();
		expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.create).toHaveBeenCalledWith(createdUserWithHashedPassword);

		expect(mockUsersRepository.findWithPassword).not.toHaveBeenCalled();
		expect(mockUsersRepository.findOneByLoginWithPassword).not.toHaveBeenCalled();
	});
});
