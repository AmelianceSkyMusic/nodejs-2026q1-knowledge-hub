import { ChatRagDto } from './chat-rag.dto';

import { MOCK } from 'src/common/constants/mock';

describe('ChatRagDto', () => {
	const payload = {
		question: MOCK.RAG.QUESTION,
		conversationId: MOCK.COMMON.ID,
	};

	it('should be defined', () => {
		expect(new ChatRagDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = ChatRagDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should allow optional conversationId', () => {
		const result = ChatRagDto.schema.safeParse({ question: MOCK.RAG.QUESTION });
		expect(result.success).toBe(true);
	});

	it('should fail if question is not a string', () => {
		const result = ChatRagDto.schema.safeParse({ question: 123 });
		expect(result.success).toBe(false);
	});
});
