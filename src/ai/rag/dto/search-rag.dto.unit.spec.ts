import { SearchRagDto } from './search-rag.dto';

import { MOCK } from 'src/common/constants/mock';

describe('SearchRagDto', () => {
	const payload = {
		query: MOCK.RAG.QUERY,
		limit: 5,
		articleStatus: MOCK.ARTICLE.STATUS,
		categoryId: MOCK.COMMON.ID,
		tags: [MOCK.COMMON.ID],
	};

	it('should be defined', () => {
		expect(new SearchRagDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = SearchRagDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should use default limit if not provided', () => {
		const result = SearchRagDto.schema.safeParse({ query: MOCK.RAG.QUERY });
		expect(result.success).toBe(true);
		expect(result.data.limit).toBe(5);
	});

	it('should fail if limit exceeds max', () => {
		const result = SearchRagDto.schema.safeParse({ ...payload, limit: 100 });
		expect(result.success).toBe(false);
	});

	it('should fail if query is empty', () => {
		const result = SearchRagDto.schema.safeParse({ ...payload, query: '' });
		expect(result.success).toBe(true);
	});
});
