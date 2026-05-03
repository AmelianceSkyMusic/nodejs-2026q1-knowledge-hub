import { ANALYZE_ARTICLE_SEVERITY } from 'shared/ai/constants/analyze-article-severity';
import { ANALYZE_ARTICLE_TASK } from 'shared/ai/constants/analyze-article-task';
import { SUMMARIZE_ARTICLE_MAX_LENGTH } from 'shared/ai/constants/summarize-article-max-length';
import { SWAGGER } from 'src/common/constants/swagger';

export const AI_SWAGGER = {
	ARTICLE_ID: {
		description: 'The unique identifier of the article',
		example: SWAGGER.EXAMPLE.ID,
	},

	MAX_LENGTH: {
		description: 'The maximum length of the summary',
		example: SUMMARIZE_ARTICLE_MAX_LENGTH.MEDIUM,
	},
	SUMMARY: {
		description: 'The summary of the article',
		example: `Some summarized text`,
	},
	ORIGINAL_LENGTH: {
		description: 'The original length of the article',
		example: 54321,
	},
	SUMMARY_LENGTH: {
		description: 'The summary length of the article',
		example: 142,
	},

	TARGET_LANGUAGE: {
		description: 'The language to translate the article to',
		example: 'en',
	},
	SOURCE_LANGUAGE: {
		description: 'The language of the article',
		example: 'jp',
	},
	TRANSLATED_TEXT: {
		description: 'The translated text of the article',
		example: `Some translated text`,
	},
	DETECTED_LANGUAGE: {
		description: 'The detected language of the article',
		example: 'en',
	},

	TASK: {
		description: 'The task to be performed on the article',
		example: ANALYZE_ARTICLE_TASK.REVIEW,
	},
	ANALYSIS: {
		description: 'The analysis of the article',
		example: `Some analysis of the article`,
	},
	SUGGESTIONS: {
		description: 'The suggestions for the article',
		example: [
			'Make sure the summary clearly states the main point',
			'Keep the summary concise and avoid unnecessary details',
		],
	},
	SEVERITY: {
		description: 'The severity of the analysis',
		example: ANALYZE_ARTICLE_SEVERITY.INFO,
	},

	MESSAGE_TO_AI: {
		description: 'The message to be sent to the AI',
		example: 'Hello, how are you?',
	},
	MESSAGE_FROM_AI: {
		description: 'The message from AI model',
		example: `I am a big language model...`,
	},
};
