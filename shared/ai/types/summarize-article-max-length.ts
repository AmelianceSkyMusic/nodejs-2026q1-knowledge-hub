import type { SUMMARIZE_ARTICLE_MAX_LENGTH } from '../constants/summarize-article-max-length';

export type SummarizeArticleMaxLength =
	(typeof SUMMARIZE_ARTICLE_MAX_LENGTH)[keyof typeof SUMMARIZE_ARTICLE_MAX_LENGTH];
