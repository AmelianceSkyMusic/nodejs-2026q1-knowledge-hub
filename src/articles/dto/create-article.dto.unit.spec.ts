import { CreateArticleDto } from './create-article.dto';

import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';
import { MOCK } from 'src/common/constants/mock';

describe('CreateArticleDto', () => {
	const payload = {
		title: MOCK.ARTICLE.TITLE,
		content: MOCK.ARTICLE.CONTENT,
		status: ARTICLE_STATUS.DRAFT,
		authorId: MOCK.COMMON.ID,
		categoryId: MOCK.COMMON.ID,
		tags: [...MOCK.ARTICLE.TAGS],
	};

	it('should be defined', () => {
		expect(new CreateArticleDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = CreateArticleDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if title is missing', () => {
		const { title, ...invalidPayload } = payload;
		const result = CreateArticleDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});
});
