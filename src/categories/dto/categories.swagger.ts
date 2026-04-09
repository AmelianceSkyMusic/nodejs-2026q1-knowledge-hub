import { CATEGORY_SORT_BY } from 'src/_shared/categories/constants/category-sort-by';
import { SWAGGER } from 'src/common/constants/swagger';

export const CATEGORY_SWAGGER = {
	ID: {
		description: 'The unique identifier (UUID) of the category',
		example: SWAGGER.EXAMPLE.ID,
	},
	NAME: {
		description: 'The name of the category',
		example: 'Technology',
	},
	DESCRIPTION: {
		description: 'A detailed description of the category',
		example: 'Articles related to server-side development with Node.js and NestJS',
	},

	TOTAL: {
		description: 'Total number of categories',
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
		description: 'List of categories',
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
			example: CATEGORY_SORT_BY.NAME,
		},
		ORDER: {
			description: 'Order',
			example: SWAGGER.EXAMPLE.ORDER,
		},
	},
};
