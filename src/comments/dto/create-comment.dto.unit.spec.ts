import { CreateCommentDto } from './create-comment.dto';

import { MOCK } from 'src/common/constants/mock';

describe('CreateCommentDto', () => {
	const payload = {
		content: MOCK.COMMENT.CONTENT,
		articleId: MOCK.COMMON.ID,
		authorId: MOCK.COMMON.ID,
	};

	it('should be defined', () => {
		expect(new CreateCommentDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = CreateCommentDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if content is empty', () => {
		const result = CreateCommentDto.schema.safeParse({ ...payload, content: '' });
		expect(result.success).toBe(false);
	});
});
