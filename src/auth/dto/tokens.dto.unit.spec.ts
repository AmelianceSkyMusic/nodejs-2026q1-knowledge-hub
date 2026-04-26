import { TokensDto } from './tokens.dto';

import { MOCK } from 'src/common/constants/mock';

describe('TokensDto', () => {
	const payload = {
		accessToken: MOCK.AUTH.ACCESS_TOKEN,
		refreshToken: MOCK.AUTH.REFRESH_TOKEN,
	};

	it('should be defined', () => {
		expect(new TokensDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = TokensDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if accessToken is missing', () => {
		const result = TokensDto.schema.safeParse({ refreshToken: MOCK.AUTH.REFRESH_TOKEN });
		expect(result.success).toBe(false);
	});
});
