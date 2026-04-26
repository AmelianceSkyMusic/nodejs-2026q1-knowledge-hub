import { createZodDto, ZodSchemaDeclarationException, ZodValidationException } from 'nestjs-zod';
import { z } from 'zod';

import { CustomZodValidationPipe } from './custom-zod-validation.pipe';

import type { ArgumentMetadata } from '@nestjs/common';

import type { AppLogger } from '../app-logger/app-logger.service';

describe('CustomZodValidationPipe', () => {
	let pipe: CustomZodValidationPipe;
	let mockLogger: AppLogger;

	const user = {
		name: 'testUser',
		password: 'testPassword',
	};

	const userWithoutPassword = {
		name: user.name,
	};

	const UserSchema = z.object({
		name: z.string(),
		password: z.string(),
	});

	const UserWithoutPasswordSchema = UserSchema.omit({
		password: true,
	});

	class UserDto extends createZodDto(UserSchema) {}

	class UserWithoutPasswordDto extends createZodDto(UserWithoutPasswordSchema) {}

	const metadataUser: ArgumentMetadata = {
		type: 'body',
		metatype: UserDto,
		data: '',
	};

	const metadataUserWithoutPassword: ArgumentMetadata = {
		type: 'body',
		metatype: UserWithoutPasswordDto,
		data: '',
	};

	beforeEach(() => {
		mockLogger = {
			error: vi.fn(),
		} as unknown as AppLogger;

		pipe = new CustomZodValidationPipe(mockLogger);
	});

	it('should be defined', () => {
		expect(pipe).toBeDefined();
	});

	it('should return value if validation succeeds', () => {
		expect(pipe.transform(user, metadataUser)).toEqual(user);
	});

	it('should return exclude password field', () => {
		expect(pipe.transform(user, metadataUserWithoutPassword)).toEqual(userWithoutPassword);
	});

	it('should throw ZodValidationException() if validation fails', () => {
		const value = { name: 123 };
		expect(() => pipe.transform(value, metadataUser)).toThrow(ZodValidationException);
	});

	it('should log custom message on ZodSchemaDeclarationException', () => {
		const badDto = null;
		const badMetadata: ArgumentMetadata = { ...metadataUser, metatype: badDto };

		expect(() => pipe.transform({}, badMetadata)).toThrow(ZodSchemaDeclarationException);
		expect(mockLogger.error).toHaveBeenCalledWith(
			expect.stringContaining('Zod Schema Declaration Error'),
			expect.any(String),
			'CustomZodValidationPipe',
		);
	});
});
