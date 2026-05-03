import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import {
	ThrottlerGuard,
	ThrottlerModuleOptions,
	ThrottlerRequest,
	ThrottlerStorage,
} from '@nestjs/throttler';

@Injectable()
export class AiThrottlerGuard extends ThrottlerGuard {
	constructor(
		options: ThrottlerModuleOptions,
		storageService: ThrottlerStorage,
		reflector: Reflector,
		private readonly configService: ConfigService,
	) {
		super(options, storageService, reflector);
	}

	protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
		const { throttler } = requestProps;

		if (throttler.name !== 'dedicated-ai') return true;

		const aiConfig = this.configService.get('ai');
		const limit = aiConfig.rateLimit;
		const ttl = 60000;

		return super.handleRequest({
			...requestProps,
			limit,
			ttl,
			throttler: { ...throttler, limit, ttl },
		});
	}
}
