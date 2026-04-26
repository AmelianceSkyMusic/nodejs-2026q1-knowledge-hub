import { ArticlesWithPaginationDto } from './articles-with-pagination.dto';

import { MOCK } from 'src/common/constants/mock';

describe('ArticlesWithPaginationDto', () => {
	const article = {
		id: MOCK.COMMON.ID,
		title: MOCK.ARTICLE.TITLE,
		content: MOCK.ARTICLE.CONTENT,
		status: MOCK.ARTICLE.STATUS,
		authorId: MOCK.COMMON.ID,
		categoryId: MOCK.COMMON.ID,
		tags: [...MOCK.ARTICLE.TAGS],
		createdAt: MOCK.COMMON.CREATED_AT,
		updatedAt: MOCK.COMMON.UPDATED_AT,
	};

	const payload = {
		total: MOCK.COMMON.TOTAL,
		page: MOCK.COMMON.PAGE,
		limit: MOCK.COMMON.LIMIT,
		data: [article],
	};

	it('should be defined', () => {
		expect(new ArticlesWithPaginationDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = ArticlesWithPaginationDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if data contains invalid article', () => {
		const result = ArticlesWithPaginationDto.schema.safeParse({
			...payload,
			data: [{ id: 'invalid-uuid' }],
		});
		expect(result.success).toBe(false);
	});
});
