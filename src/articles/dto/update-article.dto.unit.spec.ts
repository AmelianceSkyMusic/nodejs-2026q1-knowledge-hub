import { UpdateArticleDto } from './update-article.dto';

import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';
import { MOCK } from 'src/common/constants/mock';

describe('UpdateArticleDto', () => {
	const payload = {
		title: MOCK.ARTICLE.TITLE,
		content: MOCK.ARTICLE.CONTENT,
		status: ARTICLE_STATUS.PUBLISHED,
		categoryId: MOCK.COMMON.ID,
		tags: [...MOCK.ARTICLE.TAGS],
	};

	it('should be defined', () => {
		expect(new UpdateArticleDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = UpdateArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow partial update', () => {
		const result = UpdateArticleDto.schema.safeParse({ title: 'New Title' });
		expect(result.success).toBe(true);
	});

	it('should fail if categoryId is invalid', () => {
		const result = UpdateArticleDto.schema.safeParse({ categoryId: 'invalid-uuid' });
		expect(result.success).toBe(false);
	});
});
