import { CategoriesWithPaginationDto } from './categories-with-pagination.dto';

import { MOCK } from 'src/common/constants/mock';

describe('CategoriesWithPaginationDto', () => {
	const category = {
		id: MOCK.COMMON.ID,
		name: MOCK.CATEGORY.NAME,
		description: MOCK.CATEGORY.DESCRIPTION,
	};

	const payload = {
		total: MOCK.COMMON.TOTAL,
		page: MOCK.COMMON.PAGE,
		limit: MOCK.COMMON.LIMIT,
		data: [category],
	};

	it('should be defined', () => {
		expect(new CategoriesWithPaginationDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = CategoriesWithPaginationDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if data contains invalid category', () => {
		const result = CategoriesWithPaginationDto.schema.safeParse({
			...payload,
			data: [{ id: MOCK.COMMON.INVALID_ID }],
		});
		expect(result.success).toBe(false);
	});
});
