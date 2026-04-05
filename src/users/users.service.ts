import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ArticlesService } from 'src/articles/articles.service';
import { CommentsService } from 'src/comments/comments.service';
import { Id } from 'src/common/types/id';
import { sort } from 'src/common/utils/sort.util';

import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { GetUsersWithPaginationQueryRequestDto } from './dto/request/get-user-with-pagination-query.request.dto';
import { UpdatePasswordRequestDto } from './dto/request/update-password.request.dto';
import { UsersRepository } from './repository/users.repository';

import { USER_SORT_BY } from './constants/user-sort-by';
import { ERROR } from 'src/common/constants/error';
import { ORDER } from 'src/common/constants/order';

@Injectable()
export class UsersService {
	constructor(
		private readonly articlesService: ArticlesService,
		private readonly commentsService: CommentsService,
		private readonly usersRepository: UsersRepository,
	) {}

	findAll(getUsersWithPaginationQueryRequestDto: GetUsersWithPaginationQueryRequestDto) {
		const {
			page,
			limit = 10,
			sortBy = USER_SORT_BY.LOGIN,
			order = ORDER.ASC,
		} = getUsersWithPaginationQueryRequestDto;

		const allUsers = this.usersRepository.findAll();

		const sortedUsers = sort(allUsers, sortBy, order);
		if (!page) return sortedUsers;

		const offset = (page - 1) * limit;

		const paginatedData = sortedUsers.slice(offset, offset + limit);

		return {
			total: sortedUsers.length,
			page: Number(page),
			limit: Number(limit),
			data: paginatedData,
		};
	}

	findOne(userId: Id) {
		const user = this.usersRepository.findOne(userId);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		return user;
	}

	create(createUserRequestDto: CreateUserRequestDto) {
		const newUser = {
			...createUserRequestDto,
			role: createUserRequestDto.role ?? 'viewer',
			id: randomUUID(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		return this.usersRepository.create(newUser);
	}

	updatePassword(userId: Id, updatePasswordRequestDto: UpdatePasswordRequestDto) {
		const user = this.usersRepository.findOne(userId);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		if (user.password !== updatePasswordRequestDto.oldPassword) {
			throw new ForbiddenException(ERROR.PASSWORD.INVALID);
		}

		const updatedUser = {
			...user,
			password: updatePasswordRequestDto.newPassword,
			updatedAt: Date.now(),
		};
		return this.usersRepository.update(userId, updatedUser);
	}

	remove(userId: Id) {
		const isDeleted = this.usersRepository.remove(userId);
		if (!isDeleted) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		this.articlesService.nullifyAuthor(userId);

		this.commentsService.removeByAuthorId(userId);

		return isDeleted;
	}
}
