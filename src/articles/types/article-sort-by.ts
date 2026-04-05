import type { ARTICLE_SORT_BY } from '../constants/article-sort-by';

export type ArticleSortBy = (typeof ARTICLE_SORT_BY)[keyof typeof ARTICLE_SORT_BY];
