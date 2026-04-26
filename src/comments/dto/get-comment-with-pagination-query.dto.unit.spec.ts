import { GetCommentsWithPaginationQueryDto } from './get-comment-with-pagination-query.dto';

import { MOCK } from 'src/common/constants/mock';

describe('GetCommentsWithPaginationQueryDto', () => {
	const payload = {
		articleId: MOCK.COMMON.ID,
		page: MOCK.COMMON.PAGE,
		limit: MOCK.COMMON.LIMIT,
		sortBy: MOCK.COMMENT.SORT_BY,
		order: MOCK.COMMON.ORDER,
	};

	it('should be defined', () => {
		expect(new GetCommentsWithPaginationQueryDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = GetCommentsWithPaginationQueryDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow optional fields', () => {
		const result = GetCommentsWithPaginationQueryDto.schema.safeParse({
			articleId: MOCK.COMMON.ID,
		});
		expect(result.success).toBe(true);
	});
});
