import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { Id } from 'shared/common/schemas/id.schema';
import { CreateUser } from 'shared/users/schemas/create-user.schema';
import { GetUsersWithPaginationQuery } from 'shared/users/schemas/get-user-with-pagination-query.schema';
import { UpdatePassword } from 'shared/users/schemas/update-password.schema';

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
			return await this.usersRepository.create(createUser);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') throw new ConflictException(ERROR.USER.ALREADY_EXISTS);
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

		try {
			return await this.usersRepository.update(userId, { password: updatePassword.newPassword });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException(ERROR.USER.NOT_FOUND);
			}
			throw error;
		}
	}

	async remove(userId: Id) {
		try {
			return await this.usersRepository.remove(userId);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException(ERROR.USER.NOT_FOUND);
			}
			throw error;
		}
	}
}
