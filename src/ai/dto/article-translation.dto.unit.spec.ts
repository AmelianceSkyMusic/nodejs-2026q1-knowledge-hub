import { ArticleTranslationDto } from './article-translation.dto';

describe('ArticleTranslationDto', () => {
	const payload = {
		articleId: '0a0875a1-df4f-4715-a666-1d12b26911e8',
		translatedText: 'This is a translation',
		detectedLanguage: 'en',
	};

	it('should be defined', () => {
		expect(new ArticleTranslationDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = ArticleTranslationDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
	});

	it('should fail if translatedText is missing', () => {
		const { translatedText, ...invalidPayload } = payload;
		const result = ArticleTranslationDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});
});
