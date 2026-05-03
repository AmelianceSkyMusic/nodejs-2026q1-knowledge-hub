import { HttpException, HttpStatus } from '@nestjs/common';

import { AppError } from '../errors/app.error';
import { AllExceptionsFilter } from './all-exceptions.filter';

import type { ArgumentsHost } from '@nestjs/common';

describe('AllExceptionsFilter', () => {
	let filter: AllExceptionsFilter;
	let mockResponse: any;
	let mockRequest: any;
	let mockArgumentsHost: ArgumentsHost;

	beforeEach(() => {
		filter = new AllExceptionsFilter();
		mockResponse = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
		mockRequest = {
			url: '/test',
			method: 'GET',
			id: 'test-id',
			user: { userId: 'user-id' },
		};
		mockArgumentsHost = {
			switchToHttp: vi.fn().mockReturnThis(),
			getResponse: vi.fn().mockReturnValue(mockResponse),
			getRequest: vi.fn().mockReturnValue(mockRequest),
		} as unknown as ArgumentsHost;
	});

	it('should handle AppError', () => {
		const error = new AppError({
			message: 'App error message',
			statusCode: HttpStatus.BAD_REQUEST,
			errorName: 'BadRequestError',
		});

		filter.catch(error, mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
		expect(mockResponse.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'BadRequestError',
				message: 'App error message',
			}),
		);
	});

	it('should handle HttpException', () => {
		const error = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

		filter.catch(error, mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
		expect(mockResponse.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: HttpStatus.FORBIDDEN,
				message: 'Forbidden',
			}),
		);
	});

	it('should handle HttpException with object response', () => {
		const errorResponse = { error: 'Custom Error', message: 'Custom message' };
		const error = new HttpException(errorResponse, HttpStatus.BAD_REQUEST);

		filter.catch(error, mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
		expect(mockResponse.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'Custom Error',
				message: 'Custom message',
			}),
		);
	});

	it('should handle HttpException with empty object response', () => {
		const error = new HttpException({}, HttpStatus.BAD_REQUEST);

		filter.catch(error, mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
		expect(mockResponse.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: HttpStatus.BAD_REQUEST,
			}),
		);
	});

	it('should handle generic Error and return 500 with unexpected error message', () => {
		const error = new Error('Secret internal details');

		filter.catch(error, mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
		expect(mockResponse.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'An unexpected error occurred',
			}),
		);
	});

	it('should handle unknown error type and return 500 with unexpected error message', () => {
		filter.catch('Unknown error', mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
		expect(mockResponse.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'An unexpected error occurred',
			}),
		);
	});
});
