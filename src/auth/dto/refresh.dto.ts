import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { Refresh, RefreshSchema } from 'shared/auth/schemas/refresh.schema';

import { AUTH_SWAGGER } from './auth.swagger';

export class RefreshDto extends createZodDto(RefreshSchema) {
	@ApiProperty(AUTH_SWAGGER.REFRESH_TOKEN)
	refreshToken: Refresh['refreshToken'];
}
