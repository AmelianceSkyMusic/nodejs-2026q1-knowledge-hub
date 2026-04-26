import { CommentsWithPaginationDto } from './comments-with-pagination.dto';

import { MOCK } from 'src/common/constants/mock';

describe('CommentsWithPaginationDto', () => {
	const comment = {
		id: MOCK.COMMON.ID,
		content: MOCK.COMMENT.CONTENT,
		articleId: MOCK.COMMON.ID,
		authorId: MOCK.COMMON.ID,
		createdAt: MOCK.COMMON.CREATED_AT,
	};

	const payload = {
		total: MOCK.COMMON.TOTAL,
		page: MOCK.COMMON.PAGE,
		limit: MOCK.COMMON.LIMIT,
		data: [comment],
	};

	it('should be defined', () => {
		expect(new CommentsWithPaginationDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = CommentsWithPaginationDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if data contains invalid comment', () => {
		const result = CommentsWithPaginationDto.schema.safeParse({
			...payload,
			data: [{ id: MOCK.COMMON.INVALID_ID }],
		});
		expect(result.success).toBe(false);
	});
});
