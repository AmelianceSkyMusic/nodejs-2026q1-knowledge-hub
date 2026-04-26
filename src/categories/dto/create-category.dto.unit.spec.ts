import { CreateCategoryDto } from './create-category.dto';

import { MOCK } from 'src/common/constants/mock';

describe('CreateCategoryDto', () => {
	const payload = {
		name: MOCK.CATEGORY.NAME,
		description: MOCK.CATEGORY.DESCRIPTION,
	};

	it('should be defined', () => {
		expect(new CreateCategoryDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = CreateCategoryDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if name is empty', () => {
		const result = CreateCategoryDto.schema.safeParse({ ...payload, name: '' });
		expect(result.success).toBe(false);
	});
});
