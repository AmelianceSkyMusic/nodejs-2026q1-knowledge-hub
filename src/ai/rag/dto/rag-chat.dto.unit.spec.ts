import { RagChatDto, RagChatSourcesDto } from './rag-chat.dto';

import { MOCK } from 'src/common/constants/mock';

describe('RagChatDto', () => {
	const payload = {
		answer: MOCK.RAG.ANSWER,
		sources: [
			{
				articleId: MOCK.COMMON.ID,
				articleTitle: MOCK.ARTICLE.TITLE,
				relevantChunk: MOCK.RAG.CHUNK,
			},
		],
		conversationId: MOCK.COMMON.ID,
	};

	it('should be defined', () => {
		expect(new RagChatDto()).toBeDefined();
		expect(new RagChatSourcesDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = RagChatDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if sources articleId is invalid UUID', () => {
		const result = RagChatDto.schema.safeParse({
			...payload,
			sources: [{ ...payload.sources[0], articleId: MOCK.COMMON.INVALID_ID }],
		});
		expect(result.success).toBe(false);
	});
});
