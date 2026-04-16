import { StatusCodes } from 'http-status-codes';
import { request } from '../lib';
import { articlesRoutes, usersRoutes } from '../endpoints';
// import { USER_ROLES } from '../src/users/constants/user-role';

const createUserDto = {
	login: 'test-login',
	password: 'test-password',
	role: 'viewer',

};

const chars = '0123456789abcdefghijklmnopqrstuvwxyz';

const updatedUserDto = {
	oldPassword: createUserDto.password,
	newPassword: 'new-password',
};

describe('Users pagination (e2e)', () => {
	const unauthorizedRequest = request;
	const randomUUIDs: string[] = [];

	beforeAll(async () => {

		for (const char of chars) {
			const userDto = {
				...createUserDto,
				login: `${char}-${createUserDto.login}`,
			}
			const response = await unauthorizedRequest
			.post(usersRoutes.create)
			.send(userDto);

			randomUUIDs.push(response.body.id);

			expect(response.statusCode).toBe(StatusCodes.CREATED);
		}

		if (randomUUIDs.length > 0) {
			const updatedResponse = await unauthorizedRequest
			.put(usersRoutes.update(randomUUIDs[0]))
			.send(updatedUserDto);

			expect(updatedResponse.statusCode).toBe(StatusCodes.OK);
		}

	});

	afterAll(async () => {
		for (const id of randomUUIDs) {
			if (id) {
				const response = await unauthorizedRequest
					.delete(usersRoutes.delete(id));

				expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
			}
		}
	});

	describe('GET', () => {
		it('should correctly get users array without pagination', async () => {
			const response = await unauthorizedRequest
				.get(usersRoutes.getAll)

			expect(response.status).toBe(StatusCodes.OK);
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body.length).toBeGreaterThanOrEqual(chars.length);
		});

		it('should correctly get users object without pagination', async () => {
			const response = await unauthorizedRequest
				.get(`${usersRoutes.getAll}?page=1`)

			expect(response.status).toBe(StatusCodes.OK);
			expect(response.body).toHaveProperty('total');
			expect(response.body).toHaveProperty('page');
			expect(response.body).toHaveProperty('limit');
			expect(response.body).toHaveProperty('data');
		});

		it('should not get users with pagination when only limit is set', async () => {
			const response = await unauthorizedRequest
				.get(`${usersRoutes.getAll}?limit=10`)

			expect(response.status).toBe(StatusCodes.OK);

			expect(response.body).not.toHaveProperty('total');
			expect(response.body).not.toHaveProperty('page');
			expect(response.body).not.toHaveProperty('limit');
			expect(response.body).not.toHaveProperty('data');
			expect(response.body).toBeInstanceOf(Array);
		});

		it('should order users by creation date when order is asc', async () => {
			const response = await unauthorizedRequest
				.get(`${usersRoutes.getAll}?page=1&order=asc`)

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			const dataLength = data.length;
			if (dataLength > 1) {
				const firstInData = data[0];
				const lastInData = data[dataLength - 1];
				expect(firstInData.createdAt).toBeLessThanOrEqual(lastInData.createdAt);
			}
		});

		it('should order users by creation date when order is desc', async () => {
			const response = await unauthorizedRequest
				.get(`${usersRoutes.getAll}?page=1&order=desc`)

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			const dataLength = data.length;
			if (dataLength > 1) {
				const firstInData = data[0];
				const lastInData = data[dataLength - 1];
				expect(firstInData.createdAt).toBeGreaterThanOrEqual(lastInData.createdAt);
			}
		});

		it('should order users by update date when order is desc', async () => {
			const response = await unauthorizedRequest
				.get(`${usersRoutes.getAll}?page=1&sortBy=updatedAt&order=desc`)

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			const dataLength = data.length;
			if (dataLength > 1) {
				const firstInData = data[0];
				const lastInData = data[dataLength - 1];
				expect(firstInData.updatedAt).toBeGreaterThanOrEqual(lastInData.updatedAt);
			}
		});

		it('should order users by login when order is desc', async () => {
			const response = await unauthorizedRequest
				.get(`${usersRoutes.getAll}?page=1&sortBy=login&order=desc`)

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			if (data.length > 0) {
				const firstInData = data[0];
				expect(firstInData.login.startsWith('z')).toBe(true);
			}
		});

		it('should order users by login when order is asc', async () => {
			const response = await unauthorizedRequest
				.get(`${usersRoutes.getAll}?page=1&sortBy=login&order=asc`)

			expect(response.status).toBe(StatusCodes.OK);
			const { data } = response.body;

			if (data.length > 0) {
				expect(data[0].login.startsWith('0')).toBe(true);
			}
		});
	});
});
