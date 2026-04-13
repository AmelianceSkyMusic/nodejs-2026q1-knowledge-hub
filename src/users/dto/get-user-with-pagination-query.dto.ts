import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { GetUsersWithPaginationQuerySchema } from 'shared/users/schemas/get-user-with-pagination-query.schema';

import { USER_SWAGGER } from './user.swagger';

export class GetUsersWithPaginationQueryDto extends createZodDto(
	GetUsersWithPaginationQuerySchema,
) {
	@ApiProperty(USER_SWAGGER.QUERY.PAGE)
	page: any;

	@ApiProperty(USER_SWAGGER.QUERY.LIMIT)
	limit: any;

	@ApiProperty(USER_SWAGGER.QUERY.SORT_BY)
	sortBy: any;

	@ApiProperty(USER_SWAGGER.QUERY.ORDER)
	order: any;
}
