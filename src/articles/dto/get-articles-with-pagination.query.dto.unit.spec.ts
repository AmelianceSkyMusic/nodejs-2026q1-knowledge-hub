import { GetArticlesWithPaginationQueryDto } from './get-articles-with-pagination.query.dto';

import { MOCK } from 'src/common/constants/mock';

describe('GetArticlesWithPaginationQueryDto', () => {
	const payload = {
		status: MOCK.ARTICLE.STATUS,
		categoryId: MOCK.COMMON.ID,
		tag: MOCK.ARTICLE.TAG,
		page: MOCK.COMMON.PAGE,
		limit: MOCK.COMMON.LIMIT,
		sortBy: MOCK.ARTICLE.SORT_BY,
		order: MOCK.COMMON.ORDER,
	};

	it('should be defined', () => {
		expect(new GetArticlesWithPaginationQueryDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = GetArticlesWithPaginationQueryDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow optional fields', () => {
		const result = GetArticlesWithPaginationQueryDto.schema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('should fail if page is less than 1', () => {
		const result = GetArticlesWithPaginationQueryDto.schema.safeParse({ page: 0 });
		expect(result.success).toBe(false);
	});
});
