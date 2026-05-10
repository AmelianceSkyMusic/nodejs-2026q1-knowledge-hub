import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { Id } from 'shared/common/schemas/id.schema';
import { ConflictError } from 'src/common/errors/conflict.error';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { pgError } from 'src/common/utils/pg-error';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersWithPaginationQueryDto } from './dto/get-user-with-pagination-query.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserMapper } from './mappers/user.mapper';
import { UsersRepository } from './repository/users.repository';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class UsersService {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersRepository: UsersRepository,
	) {}

	async findAll(getUsersWithPaginationQueryDto: GetUsersWithPaginationQueryDto) {
		const result = await this.usersRepository.findAll(getUsersWithPaginationQueryDto);
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

	async create(createUserDto: CreateUserDto) {
		const { password, ...restCreateUser } = createUserDto;
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

	async updatePassword(userId: Id, updatePasswordDto: UpdatePasswordDto) {
		const user = await this.usersRepository.findWithPassword(userId);
		if (!user) throw new NotFoundError(ERROR.USER.NOT_FOUND);

		if (!(await compare(updatePasswordDto.oldPassword, user.password))) {
			throw new ForbiddenError(ERROR.PASSWORD.INVALID);
		}

		const salt = this.configService.get<number>('cryptSalt');
		const hashedPassword = await hash(updatePasswordDto.newPassword, salt);
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

	async createWithSignup(createUserDto: CreateUserDto) {
		const { password, ...restCreateUser } = createUserDto;
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
