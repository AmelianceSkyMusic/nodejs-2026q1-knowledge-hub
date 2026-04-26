import { UpdateCategoryDto } from './update-category.dto';

import { MOCK } from 'src/common/constants/mock';

describe('UpdateCategoryDto', () => {
	const payload = {
		name: MOCK.CATEGORY.NAME,
		description: MOCK.CATEGORY.DESCRIPTION,
	};

	it('should be defined', () => {
		expect(new UpdateCategoryDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = UpdateCategoryDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow partial update', () => {
		const result = UpdateCategoryDto.schema.safeParse({ name: MOCK.CATEGORY.NAME });
		expect(result.success).toBe(true);
	});
});
