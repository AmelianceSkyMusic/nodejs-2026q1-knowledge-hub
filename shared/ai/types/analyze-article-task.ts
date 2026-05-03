import type { ANALYZE_ARTICLE_TASK } from '../constants/analyze-article-task';

export type AnalyzeArticleTask = (typeof ANALYZE_ARTICLE_TASK)[keyof typeof ANALYZE_ARTICLE_TASK];
