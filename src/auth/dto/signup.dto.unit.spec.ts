import { SignupDto } from './signup.dto';

import { MOCK } from 'src/common/constants/mock';

describe('SignupDto', () => {
	const payload = {
		login: MOCK.USER.LOGIN,
		password: MOCK.AUTH.PASSWORD,
	};

	it('should be defined', () => {
		expect(new SignupDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = SignupDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if login is empty', () => {
		const result = SignupDto.schema.safeParse({ ...payload, login: '' });
		expect(result.success).toBe(false);
	});
});
