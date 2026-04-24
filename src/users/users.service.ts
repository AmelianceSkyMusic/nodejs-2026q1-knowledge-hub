import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Id } from 'shared/common/schemas/id.schema';
import { pgError } from 'src/common/utils/pg-error';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersWithPaginationQueryDto } from './dto/get-user-with-pagination-query.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersRepository } from './repository/users.repository';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async findAll(getUsersWithPaginationQueryDto: GetUsersWithPaginationQueryDto) {
		return await this.usersRepository.findAll(getUsersWithPaginationQueryDto);
	}

	async findOne(userId: Id) {
		const user = await this.usersRepository.findOne(userId);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		return user;
	}

	async findOneByLoginWithPassword(login: string) {
		return await this.usersRepository.findOneByLoginWithPassword(login);
	}

	async create(createUserDto: CreateUserDto) {
		const { password, ...restCreateUser } = createUserDto;
		const hashedPassword = await hash(password, 10);
		try {
			const result = await this.usersRepository.create({
				...restCreateUser,
				password: hashedPassword,
			});
			if (!result) throw new InternalServerErrorException(ERROR.USER.CREATE_FAILED);
			return result;
		} catch (error) {
			if (pgError(error).isUniqueViolation) {
				throw new ConflictException(ERROR.USER.ALREADY_EXISTS);
			}
			throw error;
		}
	}

	async updatePassword(userId: Id, updatePasswordDto: UpdatePasswordDto) {
		const user = await this.usersRepository.findWithPassword(userId);
		if (!user) throw new NotFoundException(ERROR.USER.NOT_FOUND);

		if (!(await compare(updatePasswordDto.oldPassword, user.password))) {
			throw new ForbiddenException(ERROR.PASSWORD.INVALID);
		}

		const hashedPassword = await hash(updatePasswordDto.newPassword, 10);
		const result = await this.usersRepository.update(userId, {
			password: hashedPassword,
		});
		if (!result) throw new NotFoundException(ERROR.USER.NOT_FOUND);
		return result;
	}

	async remove(userId: Id) {
		const result = await this.usersRepository.remove(userId);
		if (!result) throw new NotFoundException(ERROR.USER.NOT_FOUND);
		return result;
	}

	async createWithSignup(createUserDto: CreateUserDto) {
		const { password, ...restCreateUser } = createUserDto;
		const hashedPassword = await hash(password, 10);
		try {
			const result = await this.usersRepository.create({
				...restCreateUser,
				password: hashedPassword,
			});
			if (!result) throw new InternalServerErrorException(ERROR.USER.CREATE_FAILED);
			return result;
		} catch (error) {
			if (pgError(error).isUniqueViolation) {
				throw new BadRequestException(ERROR.USER.LOGIN_ALREADY_TAKEN);
			}
			throw error;
		}
	}
}
