import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ArticlesService } from 'src/articles/articles.service';
import { CommentsService } from 'src/comments/comments.service';
import { Id } from 'src/common/types/id';

import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdatePasswordRequestDto } from './dto/request/update-password.request.dto';
import { UsersRepository } from './repository/users.repository';

import { ERROR } from 'src/common/constants/error';

@Injectable()
export class UsersService {
	constructor(
		private readonly articlesService: ArticlesService,
		private readonly commentsService: CommentsService,
		private readonly usersRepository: UsersRepository,
	) {}

	findAll() {
		return this.usersRepository.findAll();
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
