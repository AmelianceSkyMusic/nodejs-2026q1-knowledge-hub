import { CategoryDto } from './category.dto';

import { MOCK } from 'src/common/constants/mock';

describe('CategoryDto', () => {
	const payload = {
		id: MOCK.COMMON.ID,
		name: MOCK.CATEGORY.NAME,
		description: MOCK.CATEGORY.DESCRIPTION,
	};

	it('should be defined', () => {
		expect(new CategoryDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = CategoryDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if name is missing', () => {
		const { name, ...invalidPayload } = payload;
		const result = CategoryDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});
});
