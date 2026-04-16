import {
	ConflictException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { Id } from 'shared/common/schemas/id.schema';
import { CreateUser } from 'shared/users/schemas/create-user.schema';
import { GetUsersWithPaginationQuery } from 'shared/users/schemas/get-user-with-pagination-query.schema';
import { UpdatePassword } from 'shared/users/schemas/update-password.schema';
import { pgError } from 'src/common/utils/pg-error';

import { UsersRepository } from './repository/users.repository';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async findAll(getUsersWithPaginationQuery: GetUsersWithPaginationQuery) {
		return await this.usersRepository.findAll(getUsersWithPaginationQuery);
	}

	async findOne(userId: Id) {
		const user = await this.usersRepository.findOne(userId);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		return user;
	}

	async create(createUser: CreateUser) {
		try {
			const result = await this.usersRepository.create(createUser);
			if (!result) throw new InternalServerErrorException(ERROR.USER.CREATE_FAILED);
			return result;
		} catch (error) {
			if (pgError(error).isUniqueViolation) {
				throw new ConflictException(ERROR.USER.ALREADY_EXISTS);
			}
			throw error;
		}
	}

	async updatePassword(userId: Id, updatePassword: UpdatePassword) {
		const user = await this.usersRepository.findWithPassword(userId);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		if (user.password !== updatePassword.oldPassword) {
			throw new ForbiddenException(ERROR.PASSWORD.INVALID);
		}

		const result = await this.usersRepository.update(userId, {
			password: updatePassword.newPassword,
		});
		if (!result) throw new NotFoundException(ERROR.USER.NOT_FOUND);
		return result;
	}

	async remove(userId: Id) {
		const result = await this.usersRepository.remove(userId);
		if (!result) throw new NotFoundException(ERROR.USER.NOT_FOUND);
		return result;
	}
}
