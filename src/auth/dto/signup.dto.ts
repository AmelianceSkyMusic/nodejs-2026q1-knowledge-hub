import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { SignupSchema } from 'shared/auth/schemas/signup.schema';

import { AUTH_SWAGGER } from './auth.swagger';

export class SignupDto extends createZodDto(SignupSchema) {
	@ApiProperty(AUTH_SWAGGER.LOGIN)
	login: string;

	@ApiProperty(AUTH_SWAGGER.PASSWORD)
	password: string;
}
