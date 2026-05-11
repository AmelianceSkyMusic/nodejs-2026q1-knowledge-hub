import { ReindexStatsDto } from './reindex-stats.dto';

import { MOCK } from 'src/common/constants/mock';

describe('ReindexStatsDto', () => {
	const payload = {
		indexedArticles: 10,
		indexedChunks: 50,
		vectorCollection: MOCK.RAG.COLLECTION,
	};

	it('should be defined', () => {
		expect(new ReindexStatsDto()).toBeDefined();
	});

	it('should validate a valid payload', () => {
		const result = ReindexStatsDto.schema.safeParse(payload);
		expect(result.success).toBe(true);
	});

	it('should fail if indexedArticles is not a number', () => {
		const result = ReindexStatsDto.schema.safeParse({ ...payload, indexedArticles: '10' });
		expect(result.success).toBe(false);
	});
});
