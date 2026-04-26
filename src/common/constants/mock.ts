import { ARTICLE_SORT_BY } from 'shared/articles/constants/article-sort-by';
import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';
import { CATEGORY_SORT_BY } from 'shared/categories/constants/category-sort-by';
import { COMMENT_SORT_BY } from 'shared/comments/constants/comment-sort-by';
import { ORDER } from 'shared/common/constants/order';
import { USER_ROLES } from 'shared/users/constants/user-role';
import { USER_SORT_BY } from 'shared/users/constants/user-sort-by';

export const MOCK = {
	COMMON: {
		ID: '0a0875a1-df4f-4715-a666-1d12b26911e8',
		INVALID_ID: 'invalid-uuid',
		PAGE: 1,
		LIMIT: 10,
		TOTAL: 100,
		ORDER: ORDER.ASC,
		CREATED_AT: 1655000000,
		UPDATED_AT: 1655000000,
	},
	AUTH: {
		PASSWORD: 'password',
		HASHED_PASSWORD: 'hashed-password',
		TOKEN: 'mocked-token',
		ACCESS_TOKEN: 'mocked-access-token',
		REFRESH_TOKEN: 'mocked-refresh-token',
	},
	USER: {
		LOGIN: 'login',
		SHORT_LOGIN: '',
		ROLE: USER_ROLES.ADMIN,
		SORT_BY: USER_SORT_BY.LOGIN,
	},
	ARTICLE: {
		TITLE: 'Article Title',
		CONTENT: 'Content',
		TAG: 'tag',
		TAGS: ['tag1', 'tag2', 'tag3'],
		SORT_BY: ARTICLE_SORT_BY.TITLE,
		STATUS: ARTICLE_STATUS.PUBLISHED,
	},
	CATEGORY: {
		NAME: 'Category Name',
		DESCRIPTION: 'Category Description',
		SORT_BY: CATEGORY_SORT_BY.NAME,
	},
	COMMENT: {
		CONTENT: 'Comment Content',
		SORT_BY: COMMENT_SORT_BY.CREATED_AT,
	},
} as const;
