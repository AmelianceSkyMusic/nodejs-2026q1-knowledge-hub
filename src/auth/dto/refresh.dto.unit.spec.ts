import { RefreshDto } from './refresh.dto';

import { MOCK } from 'src/common/constants/mock';

describe('RefreshDto', () => {
	const payload = {
		refreshToken: MOCK.AUTH.REFRESH_TOKEN,
	};

	it('should be defined', () => {
		expect(new RefreshDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = RefreshDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if refreshToken is invalid type', () => {
		const result = RefreshDto.schema.safeParse({ refreshToken: 123 });
		expect(result.success).toBe(false);
	});
});
