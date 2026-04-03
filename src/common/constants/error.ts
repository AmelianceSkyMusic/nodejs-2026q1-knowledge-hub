export const ERROR = {
	USER: {
		NOT_FOUND: 'User not found',
	},
	ARTICLE: {
		NOT_FOUND: 'Article not found',
	},
	CATEGORY: {
		NOT_FOUND: 'Category not found',
	},
	COMMENT: {
		NOT_FOUND: 'Comment not found',
	},
	LOGIN: {
		IS_EMPTY: 'Login is empty',
		IS_NOT_STRING: 'Login is not a string',
	},
	PASSWORD: {
		IS_EMPTY: 'Password is empty',
		IS_NOT_STRING: 'Password is not a string',
		INVALID: 'Invalid Password',
	},
	ROLE: {
		IS_NOT_STRING: 'Role is not a string',
		INVALID: 'Invalid role',
	},
} as const;
