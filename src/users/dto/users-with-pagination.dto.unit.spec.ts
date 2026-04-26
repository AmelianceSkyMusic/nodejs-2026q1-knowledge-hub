import { UsersWithPaginationDto } from './users-with-pagination.dto';

import { MOCK } from 'src/common/constants/mock';

describe('UsersWithPaginationDto', () => {
	const payload = {
		total: MOCK.COMMON.TOTAL,
		page: MOCK.COMMON.PAGE,
		limit: MOCK.COMMON.LIMIT,
		data: [
			{
				id: MOCK.COMMON.ID,
				login: MOCK.USER.LOGIN,
				role: MOCK.USER.ROLE,
				createdAt: MOCK.COMMON.CREATED_AT,
				updatedAt: MOCK.COMMON.UPDATED_AT,
			},
		],
	};

	it('should be defined', () => {
		expect(new UsersWithPaginationDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = UsersWithPaginationDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if total is negative', () => {
		const result = UsersWithPaginationDto.schema.safeParse({ ...payload, total: -1 });
		expect(result.success).toBe(false);
	});

	it('should fail if data contains invalid user', () => {
		const result = UsersWithPaginationDto.schema.safeParse({
			...payload,
			data: [{ id: 'invalid-uuid' }],
		});
		expect(result.success).toBe(false);
	});
});
