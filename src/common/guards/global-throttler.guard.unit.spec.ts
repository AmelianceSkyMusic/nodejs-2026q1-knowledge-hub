import { ThrottlerGuard } from '@nestjs/throttler';

import { GlobalThrottlerGuard } from './global-throttler.guard';

import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { ThrottlerStorage } from '@nestjs/throttler';

describe('GlobalThrottlerGuard', () => {
	let guard: GlobalThrottlerGuard;
	let reflector: Reflector;
	let mockContext: ExecutionContext;

	beforeEach(() => {
		reflector = {
			getAllAndOverride: vi.fn(),
		} as unknown as Reflector;

		mockContext = {
			getHandler: vi.fn(),
			getClass: vi.fn(),
		} as unknown as ExecutionContext;

		guard = new GlobalThrottlerGuard(
			{
				throttlers: [{ name: 'short', limit: 10, ttl: 1000 }],
			} as any,
			{} as ThrottlerStorage,
			reflector,
		);
		(guard as any).throttlers = [{ name: 'short', limit: 10, ttl: 1000 }];

		vi.unstubAllEnvs();
	});

	it('should skip if base shouldSkip returns true (e.g. via SkipThrottle or skipIf)', async () => {
		const superSpy = vi
			.spyOn(ThrottlerGuard.prototype as any, 'shouldSkip')
			.mockResolvedValue(true);

		const result = await (guard as any).shouldSkip(mockContext);

		expect(result).toBe(true);
		superSpy.mockRestore();
	});

	it('should NOT skip if base shouldSkip returns false and no tier skips are present', async () => {
		vi.spyOn(ThrottlerGuard.prototype as any, 'shouldSkip').mockResolvedValue(false);

		const result = await (guard as any).shouldSkip(mockContext);

		expect(result).toBe(false);
	});

	it('should skip if a specific tier is explicitly skipped via reflector', async () => {
		vi.spyOn(ThrottlerGuard.prototype as any, 'shouldSkip').mockResolvedValue(false);
		vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
			if (key === 'THROTTLER:SKIPshort') return true;
			return false;
		});

		const result = await (guard as any).shouldSkip(mockContext);

		expect(result).toBe(true);
	});

	it('should skip handleRequest if throttler name starts with dedicated-', async () => {
		const requestProps = {
			throttler: { name: 'dedicated-ai' },
		} as any;

		const result = await (guard as any).handleRequest(requestProps);

		expect(result).toBe(true);
	});

	it('should call super.handleRequest for normal throttlers', async () => {
		const requestProps = {
			throttler: { name: 'short' },
		} as any;

		const superSpy = vi
			.spyOn(ThrottlerGuard.prototype as any, 'handleRequest')
			.mockResolvedValue(true);

		const result = await (guard as any).handleRequest(requestProps);

		expect(result).toBe(true);
		expect(superSpy).toHaveBeenCalled();
		superSpy.mockRestore();
	});
});
