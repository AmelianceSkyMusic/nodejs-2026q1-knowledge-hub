import { ArticleDto } from './article.dto';

import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';
import { MOCK } from 'src/common/constants/mock';

describe('ArticleDto', () => {
	const payload = {
		id: MOCK.COMMON.ID,
		title: MOCK.ARTICLE.TITLE,
		content: MOCK.ARTICLE.CONTENT,
		status: ARTICLE_STATUS.DRAFT,
		authorId: MOCK.COMMON.ID,
		categoryId: MOCK.COMMON.ID,
		tags: [...MOCK.ARTICLE.TAGS],
		createdAt: MOCK.COMMON.CREATED_AT,
		updatedAt: MOCK.COMMON.UPDATED_AT,
	};

	it('should be defined', () => {
		expect(new ArticleDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = ArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if title is missing', () => {
		const { title, ...invalidPayload } = payload;
		const result = ArticleDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});

	it('should fail if status is invalid', () => {
		const result = ArticleDto.schema.safeParse({ ...payload, status: 'invalid' });
		expect(result.success).toBe(false);
	});
});
