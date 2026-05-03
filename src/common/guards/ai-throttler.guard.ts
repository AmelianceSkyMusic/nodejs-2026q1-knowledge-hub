import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import {
	ThrottlerException,
	ThrottlerGuard,
	ThrottlerLimitDetail,
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
	protected async throwThrottlingException(
		context: ExecutionContext,
		{ timeToExpire }: ThrottlerLimitDetail,
	): Promise<void> {
		const response = context.switchToHttp().getResponse();
		const secondsToWait = Math.ceil(timeToExpire).toString();

		response.setHeader('Retry-After', secondsToWait);

		throw new ThrottlerException();
	}
}
