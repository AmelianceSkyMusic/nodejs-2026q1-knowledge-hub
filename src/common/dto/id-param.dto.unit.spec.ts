import { IdParamDto } from './id-param.dto';

import { MOCK } from 'src/common/constants/mock';

describe('IdParamDto', () => {
	it('should be defined', () => {
		expect(new IdParamDto()).toBeDefined();
	});

	it('should validate a valid uuid', () => {
		const result = IdParamDto.schema.safeParse({ id: MOCK.COMMON.ID });
		expect(result.success).toBe(true);
	});

	it('should fail on invalid uuid', () => {
		const result = IdParamDto.schema.safeParse({ id: MOCK.COMMON.INVALID_ID });
		expect(result.success).toBe(false);
	});
});
