import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { UsersWithPaginationSchema } from 'shared/users/schemas/users-with-pagination.schema';

import { USER_SWAGGER } from './user.swagger';

export class UsersWithPaginationDto extends createZodDto(UsersWithPaginationSchema) {
	@ApiProperty(USER_SWAGGER.TOTAL)
	total: any;

	@ApiProperty(USER_SWAGGER.PAGE)
	page: any;

	@ApiProperty(USER_SWAGGER.LIMIT)
	limit: any;

	@ApiProperty(USER_SWAGGER.DATA)
	data: any;
}
