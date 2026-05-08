import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class AiCacheService {
	constructor(
		private readonly configService: ConfigService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async setCache(key: string, value: unknown) {
		const ttlSec = this.configService.get<number>('ai.cacheTtlSec') || 300;
		await this.cacheManager.set(key, value, ttlSec * 1000);
	}

	async getCache<T>(key: string): Promise<T | null> {
		const data = await this.cacheManager.get<T>(key);
		return data ?? null;
	}

	async hasCache(key: string): Promise<boolean> {
		const data = await this.cacheManager.get(key);
		return data !== undefined && data !== null;
	}

	async deleteCache(key: string) {
		await this.cacheManager.del(key);
	}

	async clearCache() {
		await this.cacheManager.clear();
	}
}
