import { SummarizeArticleDto } from './summarize-article.dto';

import { AI_DEFAULTS } from 'shared/ai/constants/ai-defaults';

describe('SummarizeArticleDto', () => {
	it('should be defined', () => {
		expect(new SummarizeArticleDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const payload = { maxLength: 'short' };
		const result = SummarizeArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
		expect(result.data?.maxLength).toBe('short');
	});

	it('should use default maxLength if missing', () => {
		const payload = {};
		const result = SummarizeArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
		expect(result.data?.maxLength).toBe(AI_DEFAULTS.SUMMARIZE_ARTICLE_LENGTH);
	});

	it('should fail if maxLength is invalid enum value', () => {
		const payload = { maxLength: 'invalid' };
		const result = SummarizeArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(false);
	});
});
