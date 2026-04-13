import type { CATEGORY_SORT_BY } from '../constants/category-sort-by';

export type CategorySortBy = (typeof CATEGORY_SORT_BY)[keyof typeof CATEGORY_SORT_BY];
