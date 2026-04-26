import { CreateUserDto } from './create-user.dto';

import { MOCK } from 'src/common/constants/mock';

describe('CreateUserDto', () => {
	const payload = {
		login: MOCK.USER.LOGIN,
		password: MOCK.AUTH.PASSWORD,
		role: MOCK.USER.ROLE,
	};

	it('should be defined', () => {
		expect(new CreateUserDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = CreateUserDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow optional role and use default', () => {
		const { role, ...payloadWithoutRole } = payload;
		const result = CreateUserDto.schema.safeParse(payloadWithoutRole);
		expect(result.success).toBe(true);
		expect(result.data.role).toBeDefined();
	});

	it('should fail if login is empty', () => {
		const result = CreateUserDto.schema.safeParse({ ...payload, login: '' });
		expect(result.success).toBe(false);
	});

	it('should fail if password is empty', () => {
		const result = CreateUserDto.schema.safeParse({ ...payload, password: '' });
		expect(result.success).toBe(false);
	});

	it('should fail if role is invalid', () => {
		const result = CreateUserDto.schema.safeParse({ ...payload, role: 'RSSchool' });
		expect(result.success).toBe(false);
	});
});
