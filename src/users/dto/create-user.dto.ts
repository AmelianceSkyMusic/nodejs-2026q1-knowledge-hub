import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from 'shared/users/schemas/create-user.schema';

import { USER_SWAGGER } from './user.swagger';

export class CreateUserDto extends createZodDto(CreateUserSchema) {
	@ApiProperty(USER_SWAGGER.LOGIN)
	login: any;

	@ApiProperty(USER_SWAGGER.PASSWORD)
	password: any;

	@ApiProperty(USER_SWAGGER.ROLE)
	role: any;
}
