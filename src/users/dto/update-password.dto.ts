import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UpdatePassword, UpdatePasswordSchema } from 'shared/users/schemas/update-password.schema';

import { USER_SWAGGER } from './user.swagger';

export class UpdatePasswordDto extends createZodDto(UpdatePasswordSchema) {
	@ApiProperty(USER_SWAGGER.OLD_PASSWORD)
	oldPassword: UpdatePassword['oldPassword'];

	@ApiProperty(USER_SWAGGER.NEW_PASSWORD)
	newPassword: UpdatePassword['newPassword'];
}
