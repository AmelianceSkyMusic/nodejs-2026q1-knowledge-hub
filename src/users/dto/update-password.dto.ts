import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UpdatePasswordSchema } from 'src/_shared/users/schemas/update-password.schema';

import { USER_SWAGGER } from './user.swagger';

export class UpdatePasswordDto extends createZodDto(UpdatePasswordSchema) {
	@ApiProperty(USER_SWAGGER.OLD_PASSWORD)
	oldPassword: any;

	@ApiProperty(USER_SWAGGER.NEW_PASSWORD)
	newPassword: any;
}
