import { UpdatePasswordDto } from './update-password.dto';

import { MOCK } from 'src/common/constants/mock';

describe('UpdatePasswordDto', () => {
	const payload = {
		oldPassword: MOCK.AUTH.PASSWORD,
		newPassword: MOCK.AUTH.PASSWORD,
	};

	it('should be defined', () => {
		expect(new UpdatePasswordDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = UpdatePasswordDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if oldPassword is empty', () => {
		const result = UpdatePasswordDto.schema.safeParse({ ...payload, oldPassword: '' });
		expect(result.success).toBe(false);
	});

	it('should fail if newPassword is empty', () => {
		const result = UpdatePasswordDto.schema.safeParse({ ...payload, newPassword: '' });
		expect(result.success).toBe(false);
	});
});
