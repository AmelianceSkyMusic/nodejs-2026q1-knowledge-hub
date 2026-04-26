import { UserDto } from './user.dto';

import { MOCK } from 'src/common/constants/mock';

describe('UserDto', () => {
	const payload = {
		id: MOCK.COMMON.ID,
		login: MOCK.USER.LOGIN,
		role: MOCK.USER.ROLE,
		createdAt: MOCK.COMMON.CREATED_AT,
		updatedAt: MOCK.COMMON.UPDATED_AT,
	};

	it('should be defined', () => {
		expect(new UserDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = UserDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if required fields are missing', () => {
		const { login, ...invalidPayload } = payload;
		const result = UserDto.schema.safeParse(invalidPayload);

		expect(result.success).toBe(false);
		expect(result.error.issues[0].path).toContain('login');
	});

	it('should fail if role is invalid', () => {
		const invalidPayload = { ...payload, role: 'RS-ACTIVIST' };
		const result = UserDto.schema.safeParse(invalidPayload);

		expect(result.success).toBe(false);
		expect(result.error.issues[0].path).toContain('role');
	});

	it('should fail if id is not a valid UUID', () => {
		const invalidPayload = { ...payload, id: 'invalid-uuid' };
		const result = UserDto.schema.safeParse(invalidPayload);

		expect(result.success).toBe(false);
		expect(result.error.issues[0].path).toContain('id');
	});
});
