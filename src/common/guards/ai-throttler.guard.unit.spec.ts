import { ThrottlerGuard } from '@nestjs/throttler';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AiThrottlerGuard } from './ai-throttler.guard';

import type { ExecutionContext } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Reflector } from '@nestjs/core';
import type { ThrottlerStorage } from '@nestjs/throttler';

describe('AiThrottlerGuard', () => {
	let guard: AiThrottlerGuard;
	let configService: ConfigService;
	let storage: ThrottlerStorage;
	let reflector: Reflector;

	beforeEach(() => {
		configService = {
			get: vi.fn().mockReturnValue({ rateLimit: 20 }),
		} as any;
		storage = {} as any;
		reflector = {} as any;

		guard = new AiThrottlerGuard({ throttlers: [] } as any, storage, reflector, configService);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	describe('throwThrottlingException', () => {
		it('should set Retry-After header and throw ThrottlerException', async () => {
			const setHeader = vi.fn();
			const context = {
				switchToHttp: () => ({
					getResponse: () => ({
						setHeader,
					}),
				}),
			} as unknown as ExecutionContext;

			const limitDetail = {
				timeToExpire: 10.5,
			} as any;

			await expect(guard['throwThrottlingException'](context, limitDetail)).rejects.toThrow();

			expect(setHeader).toHaveBeenCalledWith('Retry-After', '11');
		});
	});

	describe('handleRequest', () => {
		it('should bypass if throttler name is not dedicated-ai', async () => {
			const requestProps = {
				throttler: { name: 'standard' },
			} as any;

			const result = await guard['handleRequest'](requestProps);
			expect(result).toBe(true);
		});

		it('should use config limit for dedicated-ai tier', async () => {
			vi.spyOn(ThrottlerGuard.prototype as any, 'handleRequest').mockResolvedValue(true);

			const requestProps = {
				throttler: { name: 'dedicated-ai' },
				context: {
					switchToHttp: () => ({
						getRequest: () => ({}),
						getResponse: () => ({}),
					}),
				},
			} as any;

			await guard['handleRequest'](requestProps);

			expect((ThrottlerGuard.prototype as any).handleRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					limit: 20,
					ttl: 60000,
				}),
			);
		});
	});
});
