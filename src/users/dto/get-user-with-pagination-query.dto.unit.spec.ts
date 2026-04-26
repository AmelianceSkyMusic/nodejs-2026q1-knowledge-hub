import { GetUsersWithPaginationQueryDto } from './get-user-with-pagination-query.dto';

import { MOCK } from 'src/common/constants/mock';

describe('GetUsersWithPaginationQueryDto', () => {
	const payload = {
		page: MOCK.COMMON.PAGE,
		limit: MOCK.COMMON.LIMIT,
		sortBy: MOCK.USER.SORT_BY,
		order: MOCK.COMMON.ORDER,
	};

	it('should be defined', () => {
		expect(new GetUsersWithPaginationQueryDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = GetUsersWithPaginationQueryDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow optional fields and use defaults', () => {
		const result = GetUsersWithPaginationQueryDto.schema.safeParse({});
		expect(result.success).toBe(true);
		expect(result.data.limit).toBeDefined();
		expect(result.data.sortBy).toBeDefined();
		expect(result.data.order).toBeDefined();
	});

	it('should fail if page is less than 1', () => {
		const result = GetUsersWithPaginationQueryDto.schema.safeParse({ ...payload, page: 0 });
		expect(result.success).toBe(false);
	});

	it('should fail if limit is less than 1', () => {
		const result = GetUsersWithPaginationQueryDto.schema.safeParse({ ...payload, limit: 0 });
		expect(result.success).toBe(false);
	});

	it('should fail if sortBy is invalid', () => {
		const result = GetUsersWithPaginationQueryDto.schema.safeParse({
			...payload,
			sortBy: 'RSSchool',
		});
		expect(result.success).toBe(false);
	});

	it('should fail if order is invalid', () => {
		const result = GetUsersWithPaginationQueryDto.schema.safeParse({
			...payload,
			order: 'RSSchool',
		});
		expect(result.success).toBe(false);
	});

	it('should coerce string values to numbers for page and limit', () => {
		const result = GetUsersWithPaginationQueryDto.schema.safeParse({
			...payload,
			page: '1',
			limit: '10',
		});
		expect(result.success).toBe(true);
		expect(result.data.page).toBe(1);
		expect(result.data.limit).toBe(10);
	});
});
