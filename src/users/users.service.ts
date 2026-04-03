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

	findOne(id: Id) {
		const user = this.usersRepository.findOne(id);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		return user;
	}

	create(createUserDto: CreateUserRequestDto) {
		const newUser = {
			...createUserDto,
			role: createUserDto.role ?? 'viewer',
			id: randomUUID(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		return this.usersRepository.create(newUser);
	}

	updatePassword(id: Id, updatePasswordDto: UpdatePasswordRequestDto) {
		const user = this.usersRepository.findOne(id);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		if (user.password !== updatePasswordDto.oldPassword) {
			throw new ForbiddenException(ERROR.PASSWORD.INVALID);
		}

		const updatedUser = {
			...user,
			password: updatePasswordDto.newPassword,
			updatedAt: Date.now(),
		};
		return this.usersRepository.update(id, updatedUser);
	}

	remove(id: Id) {
		const isDeleted = this.usersRepository.remove(id);
		if (!isDeleted) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		this.articlesService.nullifyAuthor(id);

		this.commentsService.removeByAuthorId(id);

		return isDeleted;
	}
}
