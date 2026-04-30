import { ANALYZE_ARTICLE_TASK } from './analyze-article-task';
import { SUMMARIZE_ARTICLE_MAX_LENGTH } from './summarize-article-max-length';

export const AI_DEFAULTS = {
	SUMMARIZE_ARTICLE_LENGTH: SUMMARIZE_ARTICLE_MAX_LENGTH.MEDIUM,
	ANALYZE_ARTICLE_TASK: ANALYZE_ARTICLE_TASK.REVIEW,
} as const;
