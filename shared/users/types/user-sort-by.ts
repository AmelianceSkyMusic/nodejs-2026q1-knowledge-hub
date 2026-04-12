import type { USER_SORT_BY } from '../constants/user-sort-by';

export type UserSortBy = (typeof USER_SORT_BY)[keyof typeof USER_SORT_BY];
