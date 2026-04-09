import { COMMENT_SORT_BY } from 'src/_shared/comments/constants/comment-sort-by';
import { SWAGGER } from 'src/common/constants/swagger';

export const COMMENT_SWAGGER = {
	ID: {
		description: 'The unique identifier (UUID) of the comment',
		example: SWAGGER.EXAMPLE.ID,
	},
	CONTENT: {
		description: 'The content of the comment',
		example: 'Great article!',
	},
	ARTICLE_ID: {
		description: 'The unique identifier (UUID) of the article',
		example: SWAGGER.EXAMPLE.ID,
	},
	AUTHOR_ID: {
		description: 'The unique identifier (UUID) of the author',
		example: SWAGGER.EXAMPLE.ID,
	},
	CREATED_AT: {
		description: 'The creation timestamp of the comment',
		example: SWAGGER.EXAMPLE.TIMESTAMP,
	},
	TOTAL: {
		description: 'Total number of comments',
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
		description: 'List of comments',
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
			example: COMMENT_SORT_BY.CREATED_AT,
		},
		ORDER: {
			description: 'Order',
			example: SWAGGER.EXAMPLE.ORDER,
		},
	},
};
