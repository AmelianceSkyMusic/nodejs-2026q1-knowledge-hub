import { GetCategoriesWithPaginationQueryDto } from './get-categories-with-pagination-query.dto';

import { MOCK } from 'src/common/constants/mock';

describe('GetCategoriesWithPaginationQueryDto', () => {
	const payload = {
		page: MOCK.COMMON.PAGE,
		limit: MOCK.COMMON.LIMIT,
		sortBy: MOCK.CATEGORY.SORT_BY,
		order: MOCK.COMMON.ORDER,
	};

	it('should be defined', () => {
		expect(new GetCategoriesWithPaginationQueryDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = GetCategoriesWithPaginationQueryDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow optional fields', () => {
		const result = GetCategoriesWithPaginationQueryDto.schema.safeParse({});
		expect(result.success).toBe(true);
	});
});
