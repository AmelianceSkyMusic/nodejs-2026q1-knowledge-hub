import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	GetUsersWithPaginationQuery,
	GetUsersWithPaginationQuerySchema,
} from 'shared/users/schemas/get-user-with-pagination-query.schema';

import { USER_SWAGGER } from './user.swagger';

export class GetUsersWithPaginationQueryDto extends createZodDto(
	GetUsersWithPaginationQuerySchema,
) {
	@ApiProperty(USER_SWAGGER.QUERY.PAGE)
	page: GetUsersWithPaginationQuery['page'];

	@ApiProperty(USER_SWAGGER.QUERY.LIMIT)
	limit: GetUsersWithPaginationQuery['limit'];

	@ApiProperty(USER_SWAGGER.QUERY.SORT_BY)
	sortBy: GetUsersWithPaginationQuery['sortBy'];

	@ApiProperty(USER_SWAGGER.QUERY.ORDER)
	order: GetUsersWithPaginationQuery['order'];
}
