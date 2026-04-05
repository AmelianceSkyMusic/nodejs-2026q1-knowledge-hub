import type { ARTICLE_STATUS } from '../constants/article-status';

export type ArticleStatus = (typeof ARTICLE_STATUS)[keyof typeof ARTICLE_STATUS];
