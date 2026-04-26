import { CommentDto } from './comment.dto';

import { MOCK } from 'src/common/constants/mock';

describe('CommentDto', () => {
	const payload = {
		id: MOCK.COMMON.ID,
		content: MOCK.COMMENT.CONTENT,
		articleId: MOCK.COMMON.ID,
		authorId: MOCK.COMMON.ID,
		createdAt: MOCK.COMMON.CREATED_AT,
	};

	it('should be defined', () => {
		expect(new CommentDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = CommentDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if content is missing', () => {
		const { content, ...invalidPayload } = payload;
		const result = CommentDto.schema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});
});
