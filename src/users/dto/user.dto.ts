import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { User, UserSchema } from 'shared/users/schemas/user.schema';

import { USER_SWAGGER } from './user.swagger';

export class UserDto extends createZodDto(UserSchema) {
	@ApiProperty(USER_SWAGGER.ID)
	id: User['id'];

	@ApiProperty(USER_SWAGGER.LOGIN)
	login: User['login'];

	@ApiProperty(USER_SWAGGER.ROLE)
	role: User['role'];

	@ApiProperty(USER_SWAGGER.CREATED_AT)
	createdAt: User['createdAt'];

	@ApiProperty(USER_SWAGGER.UPDATED_AT)
	updatedAt: User['updatedAt'];
}
