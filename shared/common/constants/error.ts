export const ERROR = {
	USER: {
		NOT_FOUND: 'User not found',
		ALREADY_EXISTS: 'User already exists',
		CREATE_FAILED: 'User creation failed',
	},
	ARTICLE: {
		NOT_FOUND: 'Article not found',
		CREATE_FAILED: 'Article creation failed',
		TITLE_IS_EMPTY: 'Title is empty',
		TITLE_IS_NOT_STRING: 'Title is not a string',
		CONTENT_IS_EMPTY: 'Content is empty',
		CONTENT_IS_NOT_STRING: 'Content is not a string',
	},
	CATEGORY: {
		NOT_FOUND: 'Category not found',
		CREATE_FAILED: 'Category creation failed',
		NAME_IS_EMPTY: 'Name is empty',
		NAME_IS_NOT_STRING: 'Name is not a string',
		DESCRIPTION_IS_EMPTY: 'Description is empty',
		DESCRIPTION_IS_NOT_STRING: 'Description is not a string',
	},
	COMMENT: {
		NOT_FOUND: 'Comment not found',
		CREATE_FAILED: 'Comment creation failed',
		CONTENT_IS_EMPTY: 'Comment content is empty',
		CONTENT_IS_NOT_STRING: 'Comment content is not a string',
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
		INVALID: 'Invalid role',
	},
	VALIDATION: {
		INVALID_UUID: 'Invalid UUID format',
	},
} as const;
