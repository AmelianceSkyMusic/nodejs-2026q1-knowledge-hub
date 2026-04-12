import type { COMMENT_SORT_BY } from '../constants/comment-sort-by';

export type CommentSortBy = (typeof COMMENT_SORT_BY)[keyof typeof COMMENT_SORT_BY];
