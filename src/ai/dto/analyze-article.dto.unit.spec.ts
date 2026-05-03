import { AnalyzeArticleDto } from './analyze-article.dto';

import { AI_DEFAULTS } from 'shared/ai/constants/ai-defaults';

describe('AnalyzeArticleDto', () => {
	it('should be defined', () => {
		expect(new AnalyzeArticleDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const payload = { task: 'review' };
		const result = AnalyzeArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
		expect(result.data?.task).toBe('review');
	});

	it('should use default task if missing', () => {
		const payload = {};
		const result = AnalyzeArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
		expect(result.data?.task).toBe(AI_DEFAULTS.ANALYZE_ARTICLE_TASK);
	});

	it('should fail if task is invalid', () => {
		const payload = { task: 'invalid' };
		const result = AnalyzeArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(false);
	});
});
