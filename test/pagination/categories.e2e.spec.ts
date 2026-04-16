import { StatusCodes } from 'http-status-codes';
import { request } from '../lib';
import { categoriesRoutes } from '../endpoints';

const createCategoryDto = {
	name: 'TEST_CATEGORY',
	description: 'Test category description',
};

const chars = '-0123456789abcdefghijklmnopqrstuvwxyz';

const updatedCategoryDto = {
	name: 'UPDATED_CATEGORY',
};

describe('Categories pagination (e2e)', () => {
	const unauthorizedRequest = request;
	const randomUUIDs: string[] = [];

	beforeAll(async () => {

		for (const char of chars) {
			const categoryDto = {
				...createCategoryDto,
				name: `${char} ${createCategoryDto.name}`,
			}
			const response = await unauthorizedRequest
				.post(categoriesRoutes.create)
				.send(categoryDto);

			randomUUIDs.push(response.body.id);

			expect(response.statusCode).toBe(StatusCodes.CREATED);
		}

		if (randomUUIDs.length > 0) {
			const updatedResponse = await unauthorizedRequest
				.put(categoriesRoutes.update(randomUUIDs[0]))
				.send(updatedCategoryDto);

			expect(updatedResponse.statusCode).toBe(StatusCodes.OK);
		}

	});

	afterAll(async () => {
		for (const id of randomUUIDs) {
			if (id) {
				const response = await unauthorizedRequest
					.delete(categoriesRoutes.delete(id));

				expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
			}
		}
	});

	describe('GET', () => {
		it('should correctly get categories array without pagination', async () => {
			const response = await unauthorizedRequest
				.get(categoriesRoutes.getAll)

			expect(response.status).toBe(StatusCodes.OK);
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body.length).toBeGreaterThanOrEqual(chars.length);
		});

		it('should correctly get categories object without pagination', async () => {
			const response = await unauthorizedRequest
				.get(`${categoriesRoutes.getAll}?page=1`)

			expect(response.status).toBe(StatusCodes.OK);
			expect(response.body).toHaveProperty('total');
			expect(response.body).toHaveProperty('page');
			expect(response.body).toHaveProperty('limit');
			expect(response.body).toHaveProperty('data');
		});

		it('should not get categories with pagination when only limit is set', async () => {
			const response = await unauthorizedRequest
				.get(`${categoriesRoutes.getAll}?limit=10`)


			expect(response.status).toBe(StatusCodes.OK);

			expect(response.body).not.toHaveProperty('total');
			expect(response.body).not.toHaveProperty('page');
			expect(response.body).not.toHaveProperty('limit');
			expect(response.body).not.toHaveProperty('data');
			expect(response.body).toBeInstanceOf(Array);
		});

		it('should order categories by name when order is desc', async () => {
			const response = await unauthorizedRequest
				.get(`${categoriesRoutes.getAll}?page=1&sortBy=name&order=desc`)

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			if (data.length > 0) {
				const firstInData = data[0];
				expect(firstInData.name.startsWith('z')).toBe(true);
			}
		});

		it('should order categories by name when order is asc', async () => {
			const response = await unauthorizedRequest
				.get(`${categoriesRoutes.getAll}?page=1&sortBy=name&order=asc`)

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			if (data.length > 0) {
				expect(data[0].name.startsWith('0')).toBe(true);
			}
		});
	});
});
