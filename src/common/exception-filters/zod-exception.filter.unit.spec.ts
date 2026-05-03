import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
	ZodSchemaDeclarationException,
	ZodSerializationException,
	ZodValidationException,
} from 'nestjs-zod';
import { z, ZodError } from 'zod';

import { ZodExceptionFilter } from './zod-exception.filter';

import type { ArgumentsHost } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

describe('ZodExceptionFilter', () => {
	let filter: ZodExceptionFilter;

	const mockResponse = {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	};

	const mockRequest = {
		method: 'GET',
		url: '/test',
		id: 'test-id',
		user: { userId: 'user-id' },
	};

	const mockArgumentsHost = {
		switchToHttp: () => ({
			getResponse: () => mockResponse,
			getRequest: () => mockRequest,
		}),
	} as unknown as ArgumentsHost;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ZodExceptionFilter],
		}).compile();

		filter = module.get<ZodExceptionFilter>(ZodExceptionFilter);
		vi.clearAllMocks();
		vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
		vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
	});

	it('should be defined', () => {
		expect(filter).toBeDefined();
	});

	it('should catch ZodValidationException and return 400 status', () => {
		const result = z.string().safeParse(123);
		if (result.success) throw new Error('Validation should have failed');

		const exception = new ZodValidationException(result.error);

		filter.catch(exception, mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(mockResponse.json).toHaveBeenCalledWith({
			statusCode: 400,
			message: 'Validation failed',
			errors: result.error.issues,
		});
	});

	it('should catch ZodSerializationException and return status and log error', () => {
		const zodError = new ZodError([{ path: ['test'], message: 'invalid', code: 'custom' }]);
		const exception = new ZodSerializationException(zodError);

		filter.catch(exception, mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(Logger.prototype.error).toHaveBeenCalled();
	});

	it('should catch ZodSchemaDeclarationException and return 500 status', () => {
		const exception = new ZodSchemaDeclarationException();

		filter.catch(exception, mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 500,
				message: 'Missing nestjs-zod schema declaration (DTO) for parameter',
			}),
		);
		expect(Logger.prototype.error).toHaveBeenCalled();
	});

	it('should return 500 for unknown exception data', () => {
		const exception = {
			getStatus: () => 400,
			getZodError: () => ({}),
		} as any;

		filter.catch(exception, mockArgumentsHost);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			statusCode: 500,
			message: 'Internal Server Error',
		});
	});
});
