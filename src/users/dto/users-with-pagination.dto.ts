import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	UsersWithPagination,
	UsersWithPaginationSchema,
} from 'shared/users/schemas/users-with-pagination.schema';

import { USER_SWAGGER } from './user.swagger';

export class UsersWithPaginationDto extends createZodDto(UsersWithPaginationSchema) {
	@ApiProperty(USER_SWAGGER.TOTAL)
	total: UsersWithPagination['total'];

	@ApiProperty(USER_SWAGGER.PAGE)
	page: UsersWithPagination['page'];

	@ApiProperty(USER_SWAGGER.LIMIT)
	limit: UsersWithPagination['limit'];

	@ApiProperty(USER_SWAGGER.DATA)
	data: UsersWithPagination['data'];
}
