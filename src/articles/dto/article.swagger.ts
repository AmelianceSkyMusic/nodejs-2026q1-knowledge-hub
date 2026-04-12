import { ARTICLE_SORT_BY } from 'shared/articles/constants/article-sort-by';
import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';
import { SWAGGER } from 'src/common/constants/swagger';

export const ARTICLE_SWAGGER = {
	ID: {
		description: 'The unique identifier (UUID) of the article',
		example: SWAGGER.EXAMPLE.ID,
	},
	TITLE: {
		description: 'The title of the article',
		example: 'How to use Zod in NestJS',
	},
	CONTENT: {
		description: 'The full content of the article in markdown or plain text',
		example: 'In this article, we will explore why Zod is great for validation...',
	},
	STATUS: {
		description: 'The publication status of the article',
		example: ARTICLE_STATUS.DRAFT,
	},
	AUTHOR_ID: {
		description: 'The unique identifier (UUID) of the author',
		example: SWAGGER.EXAMPLE.ID,
	},
	CATEGORY_ID: {
		description: 'The unique identifier (UUID) of the category',
		example: SWAGGER.EXAMPLE.ID,
	},
	TAGS: {
		description: 'A list of tags associated with the article',
		example: SWAGGER.EXAMPLE.TAGS,
	},
	CREATED_AT: {
		description: 'The creation timestamp of the article',
		example: SWAGGER.EXAMPLE.TIMESTAMP,
	},
	UPDATED_AT: {
		description: 'The update timestamp of the article',
		example: SWAGGER.EXAMPLE.TIMESTAMP,
	},

	TOTAL: {
		description: 'Total number of articles',
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
		description: 'List of articles',
	},

	QUERY: {
		STATUS: {
			description: 'Filter by article status',
			example: ARTICLE_STATUS.DRAFT,
		},
		CATEGORY_ID: {
			description: 'Filter by category ID',
			example: SWAGGER.EXAMPLE.ID,
		},
		TAG: {
			description: 'Filter by tag name (can be repeated for multiple tags)',
			example: SWAGGER.EXAMPLE.TAG,
		},
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
			example: ARTICLE_SORT_BY.CREATED_AT,
		},
		ORDER: {
			description: 'Order',
			example: SWAGGER.EXAMPLE.ORDER,
		},
	},
};
