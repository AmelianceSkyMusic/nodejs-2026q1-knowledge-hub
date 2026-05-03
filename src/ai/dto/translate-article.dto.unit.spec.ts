import { TranslateArticleDto } from './translate-article.dto';

describe('TranslateArticleDto', () => {
	const payload = {
		targetLanguage: 'Ukrainian',
		sourceLanguage: 'English',
	};

	it('should be defined', () => {
		expect(new TranslateArticleDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = TranslateArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow missing sourceLanguage', () => {
		const { sourceLanguage, ...validPayload } = payload;
		const result = TranslateArticleDto.schema.safeParse(validPayload);
		expect(result.success).toBe(true);
	});

	it('should fail if targetLanguage is missing', () => {
		const { targetLanguage, ...invalidPayload } = payload;
		const result = TranslateArticleDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});
});
