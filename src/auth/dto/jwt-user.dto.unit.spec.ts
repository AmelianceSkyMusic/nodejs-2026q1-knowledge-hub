import { JwtUserDto } from './jwt-user.dto';

import { MOCK } from 'src/common/constants/mock';

describe('JwtUserDto', () => {
	const payload = {
		userId: MOCK.COMMON.ID,
		login: MOCK.USER.LOGIN,
		role: MOCK.USER.ROLE,
	};

	it('should be defined', () => {
		expect(new JwtUserDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = JwtUserDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if userId is invalid', () => {
		const result = JwtUserDto.schema.safeParse({ ...payload, userId: MOCK.COMMON.INVALID_ID });
		expect(result.success).toBe(false);
	});

	it('should fail if userId is missing', () => {
		const { userId, ...invalidPayload } = payload;
		const result = JwtUserDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});
});
