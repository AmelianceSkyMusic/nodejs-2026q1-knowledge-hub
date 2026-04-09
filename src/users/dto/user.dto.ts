import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UserSchema } from 'src/_shared/users/schemas/user.schema';

import { USER_SWAGGER } from './user.swagger';

export class UserDto extends createZodDto(UserSchema) {
	@ApiProperty(USER_SWAGGER.ID)
	id: any;

	@ApiProperty(USER_SWAGGER.LOGIN)
	login: any;

	@ApiProperty(USER_SWAGGER.ROLE)
	role: any;

	@ApiProperty(USER_SWAGGER.CREATED_AT)
	createdAt: any;

	@ApiProperty(USER_SWAGGER.UPDATED_AT)
	updatedAt: any;
}
