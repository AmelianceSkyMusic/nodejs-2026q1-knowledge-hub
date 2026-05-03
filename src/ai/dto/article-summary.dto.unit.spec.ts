import { ArticleSummaryDto } from './article-summary.dto';

describe('ArticleSummaryDto', () => {
	const payload = {
		articleId: '0a0875a1-df4f-4715-a666-1d12b26911e8',
		summary: 'This is a summary',
		originalLength: 1000,
		summaryLength: 200,
	};

	it('should be defined', () => {
		expect(new ArticleSummaryDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = ArticleSummaryDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
	});

	it('should fail if summary is missing', () => {
		const { summary, ...invalidPayload } = payload;
		const result = ArticleSummaryDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});
});
