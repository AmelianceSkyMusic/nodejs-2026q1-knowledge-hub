import { ARTICLE_SORT_BY } from './article-sort-by';
import { ARTICLE_STATUS } from './article-status';

import { ORDER } from '../../common/constants/order';

export const ARTICLE_DEFAULTS = {
	LIMIT: 10,
	SORT_BY: ARTICLE_SORT_BY.CREATED_AT,
	ORDER: ORDER.DESC,
	AUTHOR_ID: null,
	ARTICLE_STATUS: ARTICLE_STATUS.DRAFT,
	CATEGORY_ID: null,
	TAGS: [],
} as const;
