import { USER_ROLES } from 'src/_shared/users/constants/user-role';
import { USER_SORT_BY } from 'src/_shared/users/constants/user-sort-by';
import { SWAGGER } from 'src/common/constants/swagger';

export const USER_SWAGGER = {
	ID: {
		description: 'The unique identifier (UUID) of the user',
		example: SWAGGER.EXAMPLE.ID,
	},
	LOGIN: {
		description: 'The login of the user',
		example: 'TestUser',
	},
	ROLE: {
		description: 'The role of the user',
		example: USER_ROLES.VIEWER,
	},
	CREATED_AT: {
		description: 'The creation timestamp of the user',
		example: SWAGGER.EXAMPLE.TIMESTAMP,
	},
	UPDATED_AT: {
		description: 'The update timestamp of the user',
		example: SWAGGER.EXAMPLE.TIMESTAMP,
	},
	TOTAL: {
		description: 'Total number of users',
		example: SWAGGER.EXAMPLE.TOTAL,
	},
	PAGE: {
		description: 'Page number',
		example: SWAGGER.EXAMPLE.PAGE,
	},
	LIMIT: {
		description: 'Limit',
		example: SWAGGER.EXAMPLE.LIMIT,
	},
	DATA: {
		description: 'List of users',
	},
	PASSWORD: {
		description: 'The password of the user',
		example: 'Qwerty123!',
	},
	OLD_PASSWORD: {
		description: 'The old password of the user',
		example: 'Qwerty123!',
	},
	NEW_PASSWORD: {
		description: 'The new password of the user',
		example: '!123Qwerty',
	},

	QUERY: {
		PAGE: {
			description: 'Page number',
			example: SWAGGER.EXAMPLE.PAGE,
		},
		LIMIT: {
			description: 'Limit',
			example: SWAGGER.EXAMPLE.LIMIT,
		},
		SORT_BY: {
			description: 'Sort by',
			example: USER_SORT_BY.LOGIN,
		},
		ORDER: {
			description: 'Order',
			example: SWAGGER.EXAMPLE.ORDER,
		},
	},
};
