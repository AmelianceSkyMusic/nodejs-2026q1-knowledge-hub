import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { LoginSchema } from 'shared/auth/schemas/login.schema';

import { AUTH_SWAGGER } from './auth.swagger';

export class LoginDto extends createZodDto(LoginSchema) {
	@ApiProperty(AUTH_SWAGGER.LOGIN)
	login: string;

	@ApiProperty(AUTH_SWAGGER.PASSWORD)
	password: string;
}
