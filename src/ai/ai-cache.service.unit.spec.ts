import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AiCacheService } from './ai-cache.service';

describe('AiCacheService', () => {
	let service: AiCacheService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				AiCacheService,
				{
					provide: ConfigService,
					useValue: {
						get: vi.fn().mockReturnValue(300),
					},
				},
			],
		}).compile();

		service = module.get<AiCacheService>(AiCacheService);
	});

	afterEach(() => {
		service.onModuleDestroy();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should set and get cache', () => {
		service.setCache('key', 'value');
		expect(service.getCache('key')).toBe('value');
	});

	it('should return null for non-existent key', () => {
		expect(service.getCache('non-existent')).toBeNull();
	});

	it('should expire cache after TTL', () => {
		vi.useFakeTimers();
		service.setCache('key', 'value');

		vi.advanceTimersByTime(301 * 1000);

		expect(service.getCache('key')).toBeNull();
		vi.useRealTimers();
	});

	it('should identify existing cache', () => {
		service.setCache('key', 'value');
		expect(service.hasCache('key')).toBe(true);
	});

	it('should identify non-existing cache', () => {
		expect(service.hasCache('key')).toBe(false);
	});

	it('should prune expired entries via interval and keep non-expired', () => {
		vi.useFakeTimers();
		service.setCache('expired', 'value1');

		vi.advanceTimersByTime(100 * 1000);
		service.setCache('valid', 'value2');

		vi.advanceTimersByTime(250 * 1000);

		service['pruneExpired']();

		expect(service.getCache('expired')).toBeNull();
		expect(service.getCache('valid')).toBe('value2');
		vi.useRealTimers();
	});
});
