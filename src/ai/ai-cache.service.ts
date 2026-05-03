import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiCacheService {
	private pruneInterval: NodeJS.Timeout;

	constructor(private readonly configService: ConfigService) {
		this.pruneInterval = setInterval(() => this.pruneExpired(), 3600 * 1000);
	}

	onModuleDestroy() {
		clearInterval(this.pruneInterval);
	}

	private readonly aiCache = new Map<
		string,
		{ data: unknown; ttlMs: number; createdAt: number }
	>();

	private pruneExpired() {
		const now = Date.now();
		for (const [key, entry] of this.aiCache.entries()) {
			if (now - entry.createdAt > entry.ttlMs) {
				this.aiCache.delete(key);
			}
		}
	}

	setCache(key: string, value: unknown) {
		const ttlSec = this.configService.get<number>('ai.cacheTtlSec');
		this.aiCache.set(key, {
			data: value,
			ttlMs: ttlSec * 1000,
			createdAt: Date.now(),
		});
	}

	getCache<T>(key: string): T | null {
		const entry = this.aiCache.get(key);
		if (!entry) return null;

		const isExpired = Date.now() - entry.createdAt > entry.ttlMs;
		if (isExpired) {
			this.aiCache.delete(key);
			return null;
		}

		return entry.data as T;
	}

	hasCache(key: string) {
		return !!this.getCache(key);
	}
}
