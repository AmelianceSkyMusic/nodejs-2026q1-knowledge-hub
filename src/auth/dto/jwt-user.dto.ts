import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { JwtUser, JwtUserSchema } from 'shared/auth/schemas/jwt-user.schema';
import { USER_SWAGGER } from 'src/users/dto/user.swagger';

export class JwtUserDto extends createZodDto(JwtUserSchema) {
	@ApiProperty(USER_SWAGGER.ID)
	userId: JwtUser['userId'];

	@ApiProperty(USER_SWAGGER.LOGIN)
	login: JwtUser['login'];

	@ApiProperty(USER_SWAGGER.ROLE)
	role: JwtUser['role'];
}
