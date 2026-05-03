import { SUMMARIZE_ARTICLE_MAX_LENGTH } from 'shared/ai/constants/summarize-article-max-length';

import type { SummarizeArticleMaxLength } from 'shared/ai/types/summarize-article-max-length';

export function getSummarizeArticleMaxLengthPrompt(maxLength: SummarizeArticleMaxLength) {
	const basePrompt = 'Return a clear, concise summary of the article content';
	return {
		[SUMMARIZE_ARTICLE_MAX_LENGTH.SHORT]: `${basePrompt} in 1–3 sentences, but not longer than 1/8 of the original article content`,
		[SUMMARIZE_ARTICLE_MAX_LENGTH.MEDIUM]: `${basePrompt} in 4–6 sentences, but not longer than 1/4 of the original article content`,
		[SUMMARIZE_ARTICLE_MAX_LENGTH.DETAILED]: `${basePrompt} in 8–10 sentences, but not longer than 1/2 article content. Very detailed`,
	}[maxLength];
}
