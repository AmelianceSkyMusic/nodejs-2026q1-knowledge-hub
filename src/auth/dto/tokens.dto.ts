import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { TokensSchema } from 'shared/auth/schemas/tokens.schema';

import { AUTH_SWAGGER } from './auth.swagger';

export class TokensDto extends createZodDto(TokensSchema) {
	@ApiProperty(AUTH_SWAGGER.ACCESS_TOKEN)
	accessToken: string;

	@ApiProperty(AUTH_SWAGGER.REFRESH_TOKEN)
	refreshToken: string;
}
