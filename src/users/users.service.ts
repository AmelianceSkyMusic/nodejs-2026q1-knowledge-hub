import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { Id } from 'shared/common/schemas/id.schema';
import { CreateUser } from 'shared/users/schemas/create-user.schema';
import { GetUsersWithPaginationQuery } from 'shared/users/schemas/get-user-with-pagination-query.schema';
import { UpdatePassword } from 'shared/users/schemas/update-password.schema';
import { ConflictError } from 'src/common/errors/conflict.error';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { pgError } from 'src/common/utils/pg-error';

import { UserMapper } from './mappers/user.mapper';
import { UsersRepository } from './repository/users.repository';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class UsersService {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersRepository: UsersRepository,
	) {}

	async findAll(getUsersWithPaginationQuery: GetUsersWithPaginationQuery) {
		const result = await this.usersRepository.findAll(getUsersWithPaginationQuery);
		if ('data' in result) {
			return { ...result, data: UserMapper.toUsers(result.data) };
		}
		return UserMapper.toUsers(result);
	}

	async findOne(userId: Id) {
		const user = await this.usersRepository.findOne(userId);
		if (!user) throw new NotFoundError(ERROR.USER.NOT_FOUND);

		return UserMapper.toUser(user);
	}

	async findOneByLoginWithPassword(login: string) {
		return await this.usersRepository.findOneByLoginWithPassword(login);
	}

	async create(createUser: CreateUser) {
		const { password, ...restCreateUser } = createUser;
		const salt = this.configService.get<number>('cryptSalt');
		const hashedPassword = await hash(password, salt);
		try {
			const result = await this.usersRepository.create({
				...restCreateUser,
				password: hashedPassword,
			});
			if (!result) throw new InternalServerError(ERROR.USER.CREATE_FAILED);
			return UserMapper.toUser(result);
		} catch (error) {
			if (pgError(error).isUniqueViolation) {
				throw new ConflictError(ERROR.USER.ALREADY_EXISTS);
			}
			throw error;
		}
	}

	async updatePassword(userId: Id, updatePassword: UpdatePassword) {
		const user = await this.usersRepository.findWithPassword(userId);
		if (!user) throw new NotFoundError(ERROR.USER.NOT_FOUND);

		if (!(await compare(updatePassword.oldPassword, user.password))) {
			throw new ForbiddenError(ERROR.PASSWORD.INVALID);
		}

		const salt = this.configService.get<number>('cryptSalt');
		const hashedPassword = await hash(updatePassword.newPassword, salt);
		const result = await this.usersRepository.update(userId, {
			password: hashedPassword,
		});
		if (!result) throw new NotFoundError(ERROR.USER.NOT_FOUND);
		return UserMapper.toUser(result);
	}

	async remove(userId: Id) {
		const result = await this.usersRepository.remove(userId);
		if (!result) throw new NotFoundError(ERROR.USER.NOT_FOUND);
		return UserMapper.toUser(result);
	}

	async createWithSignup(createUser: CreateUser) {
		const { password, ...restCreateUser } = createUser;
		const salt = this.configService.get<number>('cryptSalt');
		const hashedPassword = await hash(password, salt);
		try {
			const result = await this.usersRepository.create({
				...restCreateUser,
				password: hashedPassword,
			});
			if (!result) throw new InternalServerError(ERROR.USER.CREATE_FAILED);
			return UserMapper.toUser(result);
		} catch (error) {
			if (pgError(error).isUniqueViolation) {
				throw new ConflictError(ERROR.USER.LOGIN_ALREADY_TAKEN);
			}
			throw error;
		}
	}
}
