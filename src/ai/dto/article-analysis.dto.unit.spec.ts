import { ArticleAnalysisDto } from './article-analysis.dto';

describe('ArticleAnalysisDto', () => {
	const payload = {
		articleId: '0a0875a1-df4f-4715-a666-1d12b26911e8',
		analysis: 'Analysis content',
		suggestions: ['suggestion 1'],
		severity: 'info',
	};

	it('should be defined', () => {
		expect(new ArticleAnalysisDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = ArticleAnalysisDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
	});

	it('should fail if analysis is missing', () => {
		const { analysis, ...invalidPayload } = payload;
		const result = ArticleAnalysisDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});

	it('should fail if severity is missing', () => {
		const { severity, ...invalidPayload } = payload;
		const result = ArticleAnalysisDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});

	it('should fail if suggestions are missing', () => {
		const { suggestions, ...invalidPayload } = payload;
		const result = ArticleAnalysisDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});
});
