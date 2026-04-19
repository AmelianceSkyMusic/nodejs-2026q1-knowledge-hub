import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CreateUser, CreateUserSchema } from 'shared/users/schemas/create-user.schema';

import { USER_SWAGGER } from './user.swagger';

export class CreateUserDto extends createZodDto(CreateUserSchema) {
	@ApiProperty(USER_SWAGGER.LOGIN)
	login: CreateUser['login'];

	@ApiProperty(USER_SWAGGER.PASSWORD)
	password: CreateUser['password'];

	@ApiProperty(USER_SWAGGER.ROLE)
	role: CreateUser['role'];
}
