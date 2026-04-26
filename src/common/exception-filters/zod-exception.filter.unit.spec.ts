import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ZodValidationException } from 'nestjs-zod';
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

	const mockArgumentsHost = {
		switchToHttp: () => ({
			getResponse: () => mockResponse,
		}),
	} as unknown as ArgumentsHost;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ZodExceptionFilter],
		}).compile();

		filter = module.get<ZodExceptionFilter>(ZodExceptionFilter);
		vi.clearAllMocks();
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

	it('should log warning for ZodValidationException', () => {
		const loggerSpy = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
		const zodError = new ZodError([]);
		const exception = new ZodValidationException(zodError);

		filter.catch(exception, mockArgumentsHost);

		expect(loggerSpy).toHaveBeenCalled();
		loggerSpy.mockRestore();
	});
});
