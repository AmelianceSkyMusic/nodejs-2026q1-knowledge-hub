import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { vi } from 'vitest';

import { AiThrottlerGuard } from './ai-throttler.guard';

import type { ExecutionContext } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import type { ThrottlerRequest, ThrottlerStorage } from '@nestjs/throttler';

describe('AiThrottlerGuard', () => {
	let guard: AiThrottlerGuardTest;
	let configService: ConfigService;

	class AiThrottlerGuardTest extends AiThrottlerGuard {
		async testHandleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
			return this.handleRequest(requestProps);
		}
		async testShouldSkip(context: ExecutionContext): Promise<boolean> {
			return this.shouldSkip(context);
		}
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: AiThrottlerGuardTest,
					useFactory: (config: ConfigService, reflector: Reflector) =>
						new AiThrottlerGuardTest(
							{ throttlers: [] },
							{} as ThrottlerStorage,
							reflector,
							config,
						),
					inject: [ConfigService, Reflector],
				},
				{
					provide: ConfigService,
					useValue: { get: vi.fn() },
				},
				{
					provide: Reflector,
					useValue: { getAllAndOverride: vi.fn() },
				},
			],
		}).compile();

		guard = module.get<AiThrottlerGuardTest>(AiThrottlerGuardTest);
		configService = module.get<ConfigService>(ConfigService);

		vi.spyOn(
			Object.getPrototypeOf(AiThrottlerGuard.prototype),
			'handleRequest',
		).mockResolvedValue(true);
	});

	it('should follow standard skipping logic (return false by default)', async () => {
		const result = await guard.testShouldSkip({} as ExecutionContext);
		expect(result).toBe(false);
	});

	it('should skip processing if throttler name is not "dedicated-ai"', async () => {
		const requestProps = {
			throttler: { name: 'short' },
		} as ThrottlerRequest;

		const result = await guard.testHandleRequest(requestProps);

		expect(result).toBe(true);
		expect(configService.get).not.toHaveBeenCalled();
	});

	it('should apply AI limits if throttler name is "dedicated-ai"', async () => {
		const throttler = { name: 'dedicated-ai' };
		const requestProps = {
			throttler,
			context: {} as ExecutionContext,
		} as ThrottlerRequest;

		vi.spyOn(configService, 'get').mockReturnValue({ rateLimit: 20 });

		const result = await guard.testHandleRequest(requestProps);

		expect(result).toBe(true);
		expect(configService.get).toHaveBeenCalledWith('ai');
		expect(Object.getPrototypeOf(AiThrottlerGuard.prototype).handleRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				limit: 20,
				ttl: 60000,
				throttler: expect.objectContaining({ name: 'dedicated-ai', limit: 20, ttl: 60000 }),
			}),
		);
	});
});
