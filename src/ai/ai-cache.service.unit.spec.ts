import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AiCacheService } from './ai-cache.service';

describe('AiCacheService', () => {
	let service: AiCacheService;
	let cacheManager: any;

	beforeEach(async () => {
		cacheManager = {
			get: vi.fn(),
			set: vi.fn(),
			del: vi.fn(),
			clear: vi.fn(),
		};

		const module = await Test.createTestingModule({
			providers: [
				AiCacheService,
				{
					provide: ConfigService,
					useValue: {
						get: vi.fn().mockReturnValue(300),
					},
				},
				{
					provide: CACHE_MANAGER,
					useValue: cacheManager,
				},
			],
		}).compile();

		service = module.get<AiCacheService>(AiCacheService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should set cache with TTL', async () => {
		await service.setCache('key', 'value');
		expect(cacheManager.set).toHaveBeenCalledWith('key', 'value', 300 * 1000);
	});

	it('should get cache', async () => {
		cacheManager.get.mockResolvedValue('value');
		const result = await service.getCache('key');
		expect(result).toBe('value');
		expect(cacheManager.get).toHaveBeenCalledWith('key');
	});

	it('should return null for non-existent key', async () => {
		cacheManager.get.mockResolvedValue(null);
		expect(await service.getCache('non-existent')).toBeNull();
	});

	it('should identify existing cache', async () => {
		cacheManager.get.mockResolvedValue('value');
		expect(await service.hasCache('key')).toBe(true);
	});

	it('should identify non-existing cache', async () => {
		cacheManager.get.mockResolvedValue(null);
		expect(await service.hasCache('key')).toBe(false);
	});

	it('should delete cache', async () => {
		await service.deleteCache('key');
		expect(cacheManager.del).toHaveBeenCalledWith('key');
	});

	it('should clear cache', async () => {
		await service.clearCache();
		expect(cacheManager.clear).toHaveBeenCalled();
	});
});
