import { RagSearchDto, RagSearchElementDto } from './rag-search.dto';

import { MOCK } from 'src/common/constants/mock';

describe('RagSearchDto', () => {
	const payload = {
		results: [
			{
				articleId: MOCK.COMMON.ID,
				articleTitle: MOCK.ARTICLE.TITLE,
				chunk: MOCK.RAG.CHUNK,
				similarity: MOCK.RAG.SIMILARITY,
			},
		],
	};

	it('should be defined', () => {
		expect(new RagSearchDto()).toBeDefined();
		expect(new RagSearchElementDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = RagSearchDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if results is not an array', () => {
		const result = RagSearchDto.schema.safeParse({ results: {} });
		expect(result.success).toBe(false);
	});
});
