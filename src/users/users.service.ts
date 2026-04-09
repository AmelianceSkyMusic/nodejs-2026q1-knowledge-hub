import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Id } from 'src/_shared/common/schemas/id.schema';
import { ArticlesService } from 'src/articles/articles.service';
import { CommentsService } from 'src/comments/comments.service';
import { sort } from 'src/common/utils/sort.util';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersWithPaginationQueryDto } from './dto/get-user-with-pagination-query.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersRepository } from './repository/users.repository';

import { ERROR } from 'src/_shared/common/constants/error';

@Injectable()
export class UsersService {
	constructor(
		private readonly articlesService: ArticlesService,
		private readonly commentsService: CommentsService,
		private readonly usersRepository: UsersRepository,
	) {}

	findAll(getUsersWithPaginationQueryDto: GetUsersWithPaginationQueryDto) {
		const { page, limit, sortBy, order } = getUsersWithPaginationQueryDto;

		const allUsers = this.usersRepository.findAll();

		const sortedUsers = sort(allUsers, sortBy, order);
		if (!page) return sortedUsers;

		const offset = (page - 1) * limit;

		const paginatedData = sortedUsers.slice(offset, offset + limit);

		return {
			total: sortedUsers.length,
			page,
			limit,
			data: paginatedData,
		};
	}

	findOne(userId: Id) {
		const user = this.usersRepository.findOne(userId);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		return user;
	}

	create(createUserDto: CreateUserDto) {
		const timestamp = Date.now();
		const newUser = {
			...createUserDto,
			id: randomUUID(),
			createdAt: timestamp,
			updatedAt: timestamp,
		};
		return this.usersRepository.create(newUser);
	}

	updatePassword(userId: Id, updatePasswordDto: UpdatePasswordDto) {
		const user = this.usersRepository.findOne(userId);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		if (user.password !== updatePasswordDto.oldPassword) {
			throw new ForbiddenException(ERROR.PASSWORD.INVALID);
		}

		const updatedUser = {
			...user,
			password: updatePasswordDto.newPassword,
			updatedAt: Date.now(),
		};

		const result = this.usersRepository.update(userId, updatedUser);
		if (!result) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		return result;
	}

	remove(userId: Id) {
		const isDeleted = this.usersRepository.remove(userId);
		if (!isDeleted) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		this.articlesService.nullifyAuthor(userId);

		this.commentsService.removeByAuthorId(userId);

		return isDeleted;
	}
}
