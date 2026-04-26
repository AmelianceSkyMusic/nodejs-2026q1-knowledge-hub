import { LoginDto } from './login.dto';

import { MOCK } from 'src/common/constants/mock';

describe('LoginDto', () => {
	const payload = {
		login: MOCK.USER.LOGIN,
		password: MOCK.AUTH.PASSWORD,
	};

	it('should be defined', () => {
		expect(new LoginDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = LoginDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if password is empty', () => {
		const result = LoginDto.schema.safeParse({ ...payload, password: '' });
		expect(result.success).toBe(false);
	});
});
