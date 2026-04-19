import { StatusCodes } from 'http-status-codes';

import { articlesRoutes, commentsRoutes, usersRoutes } from '../endpoints';
import { request } from '../lib';

const userDto = {
	login: 'test-login',
	password: 'test-password',
	role: 'viewer',
};

const createArticleDto = {
	title: 'TEST_ARTICLE',
	content: 'Test article content',
	status: 'draft',
	authorId: null,
	categoryId: null,
	tags: [],
};

const createCommentDto = {
	content: 'Test comment content',
};

const chars = '0123456789abcdefghijklmnopqrstuvwxyz';

describe('Comments pagination (e2e)', () => {
	const unauthorizedRequest = request;
	const randomUUIDs: string[] = [];
	let articleId: string;
	let userId: string;

	beforeAll(async () => {
		const user = await unauthorizedRequest.post(usersRoutes.create).send(userDto);

		userId = user.body.id;

		const article = await unauthorizedRequest.post(articlesRoutes.create).send(createArticleDto);

		articleId = article.body.id;

		for (const char of chars) {
			const commentDto = {
				...createCommentDto,
				authorId: userId,
				content: `${char} ${createCommentDto.content}`,
				articleId,
			};
			const response = await unauthorizedRequest.post(commentsRoutes.create).send(commentDto);

			randomUUIDs.push(response.body.id);

			expect(response.statusCode).toBe(StatusCodes.CREATED);
		}
	});

	afterAll(async () => {
		for (const id of randomUUIDs) {
			if (id) {
				const response = await unauthorizedRequest.delete(commentsRoutes.delete(id));

				expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
			}
		}

		if (articleId) {
			const response = await unauthorizedRequest.delete(articlesRoutes.delete(articleId));

			expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
		}

		if (userId) {
			const response = await unauthorizedRequest.delete(usersRoutes.delete(userId));

			expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
		}
	});

	describe('GET', () => {
		it('should correctly get comments array without pagination', async () => {
			const response = await unauthorizedRequest.get(commentsRoutes.getByArticle(articleId));

			expect(response.status).toBe(StatusCodes.OK);
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body.length).toBeGreaterThanOrEqual(chars.length);
		});

		it('should correctly get comments object without pagination', async () => {
			const response = await unauthorizedRequest.get(
				`${commentsRoutes.getByArticle(articleId)}&page=1`,
			);

			expect(response.status).toBe(StatusCodes.OK);
			expect(response.body).toHaveProperty('total');
			expect(response.body).toHaveProperty('page');
			expect(response.body).toHaveProperty('limit');
			expect(response.body).toHaveProperty('data');
		});

		it('should not get comments with pagination when only limit is set', async () => {
			const response = await unauthorizedRequest.get(
				`${commentsRoutes.getByArticle(articleId)}&limit=10`,
			);

			expect(response.status).toBe(StatusCodes.OK);

			expect(response.body).not.toHaveProperty('total');
			expect(response.body).not.toHaveProperty('page');
			expect(response.body).not.toHaveProperty('limit');
			expect(response.body).not.toHaveProperty('data');
			expect(response.body).toBeInstanceOf(Array);
		});

		it('should order comments by creation date when order is asc', async () => {
			const response = await unauthorizedRequest.get(
				`${commentsRoutes.getByArticle(articleId)}&page=1&order=asc`,
			);

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			const dataLength = data.length;
			if (dataLength > 1) {
				const firstInData = data[0];
				const lastInData = data[dataLength - 1];
				expect(firstInData.createdAt).toBeLessThanOrEqual(lastInData.createdAt);
			}
		});

		it('should order comments by creation date when order is desc', async () => {
			const response = await unauthorizedRequest.get(
				`${commentsRoutes.getByArticle(articleId)}&page=1&order=desc`,
			);

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			const dataLength = data.length;
			if (dataLength > 1) {
				const firstInData = data[0];
				const lastInData = data[dataLength - 1];
				expect(firstInData.createdAt).toBeGreaterThanOrEqual(lastInData.createdAt);
			}
		});
	});
});
