import { StatusCodes } from 'http-status-codes';

import { articlesRoutes } from '../endpoints';
import { request } from '../lib';
import { getTokenAndUserId, removeTokenUser, shouldAuthorizationBeTested } from '../utils';

const createArticleDto = {
	title: 'TEST_ARTICLE',
	content: 'Test article content',
	status: 'draft',
	authorId: null,
	categoryId: null,
	tags: [],
};

const chars = '-0123456789abcdefghijklmnopqrstuvwxyz';

const updatedArticleDto = {
	title: 'UPDATED_ARTICLE',
};

describe('Articles pagination (e2e)', () => {
	const unauthorizedRequest = request;
	const commonHeaders = { Accept: 'application/json' };
	const randomUUIDs: string[] = [];
	let mockUserId: string | undefined;

	beforeAll(async () => {
		if (shouldAuthorizationBeTested) {
			const result = await getTokenAndUserId(unauthorizedRequest);
			commonHeaders['Authorization'] = result.token;
			mockUserId = result.mockUserId;
		}

		for (const char of chars) {
			const articleDto = {
				...createArticleDto,
				title: `${char} ${createArticleDto.title}`,
			};
			const response = await unauthorizedRequest
				.post(articlesRoutes.create)
				.set(commonHeaders)
				.send(articleDto);

			randomUUIDs.push(response.body.id);

			expect(response.statusCode).toBe(StatusCodes.CREATED);
		}

		if (randomUUIDs.length > 0) {
			const updatedResponse = await unauthorizedRequest
				.put(articlesRoutes.update(randomUUIDs[0]))
				.set(commonHeaders)
				.send(updatedArticleDto);

			expect(updatedResponse.statusCode).toBe(StatusCodes.OK);
		}
	});

	afterAll(async () => {
		for (const id of randomUUIDs) {
			if (id) {
				const response = await unauthorizedRequest
					.delete(articlesRoutes.delete(id))
					.set(commonHeaders);

				expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
			}
		}

		if (mockUserId) {
			await removeTokenUser(unauthorizedRequest, mockUserId, commonHeaders);
		}
	});

	describe('GET', () => {
		it('should correctly get articles array without pagination', async () => {
			const response = await unauthorizedRequest.get(articlesRoutes.getAll).set(commonHeaders);

			expect(response.status).toBe(StatusCodes.OK);
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body.length).toBeGreaterThanOrEqual(chars.length);
		});

		it('should correctly get articles object without pagination', async () => {
			const response = await unauthorizedRequest
				.get(`${articlesRoutes.getAll}?page=1`)
				.set(commonHeaders);

			expect(response.status).toBe(StatusCodes.OK);
			expect(response.body).toHaveProperty('total');
			expect(response.body).toHaveProperty('page');
			expect(response.body).toHaveProperty('limit');
			expect(response.body).toHaveProperty('data');
		});

		it('should not get articles with pagination when only limit is set', async () => {
			const response = await unauthorizedRequest
				.get(`${articlesRoutes.getAll}?limit=10`)
				.set(commonHeaders);

			expect(response.status).toBe(StatusCodes.OK);

			expect(response.body).not.toHaveProperty('total');
			expect(response.body).not.toHaveProperty('page');
			expect(response.body).not.toHaveProperty('limit');
			expect(response.body).not.toHaveProperty('data');
			expect(response.body).toBeInstanceOf(Array);
		});

		it('should order articles by creation date when order is asc', async () => {
			const response = await unauthorizedRequest
				.get(`${articlesRoutes.getAll}?page=1&order=asc`)
				.set(commonHeaders);

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			const dataLength = data.length;
			if (dataLength > 1) {
				const firstInData = data[0];
				const lastInData = data[dataLength - 1];
				expect(firstInData.createdAt).toBeLessThanOrEqual(lastInData.createdAt);
			}
		});

		it('should order articles by creation date when order is desc', async () => {
			const response = await unauthorizedRequest
				.get(`${articlesRoutes.getAll}?page=1&order=desc`)
				.set(commonHeaders);

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			const dataLength = data.length;
			if (dataLength > 1) {
				const firstInData = data[0];
				const lastInData = data[dataLength - 1];
				expect(firstInData.createdAt).toBeGreaterThanOrEqual(lastInData.createdAt);
			}
		});

		it('should order articles by update date when order is desc', async () => {
			const response = await unauthorizedRequest
				.get(`${articlesRoutes.getAll}?page=1&sortBy=updatedAt&order=desc`)
				.set(commonHeaders);

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			const dataLength = data.length;
			if (dataLength > 1) {
				const firstInData = data[0];
				const lastInData = data[dataLength - 1];
				expect(firstInData.updatedAt).toBeGreaterThanOrEqual(lastInData.updatedAt);
				expect(firstInData.title).toBe(updatedArticleDto.title);
			}
		});

		it('should order articles by title when order is desc', async () => {
			const response = await unauthorizedRequest
				.get(`${articlesRoutes.getAll}?page=1&sortBy=title&order=desc`)
				.set(commonHeaders);

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			if (data.length > 0) {
				const firstInData = data[0];
				expect(firstInData.title.startsWith('z')).toBe(true);
			}
		});

		it('should order articles by title when order is asc', async () => {
			const response = await unauthorizedRequest
				.get(`${articlesRoutes.getAll}?page=1&sortBy=title&order=asc`)
				.set(commonHeaders);

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			if (data.length > 0) {
				expect(data[0].title.startsWith('0')).toBe(true);
			}
		});
	});
});
