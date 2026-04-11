import { ORDER } from '../../common/constants/order';
import { COMMENT_SORT_BY } from '../constants/comment-sort-by';

export const COMMENT_DEFAULTS = {
	authorId: null,
	LIMIT: 10,
	SORT_BY: COMMENT_SORT_BY.CREATED_AT,
	ORDER: ORDER.ASC,
};
