import { ReindexDto } from './reindex.dto';

import { MOCK } from 'src/common/constants/mock';

describe('ReindexDto', () => {
	const payload = {
		onlyPublished: true,
		articleIds: [MOCK.COMMON.ID],
	};

	it('should be defined', () => {
		expect(new ReindexDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = ReindexDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow optional fields and use defaults', () => {
		const result = ReindexDto.schema.safeParse({});
		expect(result.success).toBe(true);
		expect(result.data.onlyPublished).toBe(true);
	});

	it('should fail if articleIds contains invalid UUID', () => {
		const result = ReindexDto.schema.safeParse({
			...payload,
			articleIds: [MOCK.COMMON.INVALID_ID],
		});
		expect(result.success).toBe(false);
	});
});
