import { COMMENT_SORT_BY } from './comment-sort-by';

import { ORDER } from '../../common/constants/order';

export const COMMENT_DEFAULTS = {
	authorId: null,
	LIMIT: 10,
	SORT_BY: COMMENT_SORT_BY.CREATED_AT,
	ORDER: ORDER.ASC,
};
