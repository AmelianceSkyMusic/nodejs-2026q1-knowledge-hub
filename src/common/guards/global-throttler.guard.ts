import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
	ThrottlerGuard,
	ThrottlerModuleOptions,
	ThrottlerRequest,
	ThrottlerStorage,
} from '@nestjs/throttler';

@Injectable()
export class GlobalThrottlerGuard extends ThrottlerGuard {
	constructor(
		options: ThrottlerModuleOptions,
		storageService: ThrottlerStorage,
		reflector: Reflector,
	) {
		super(options, storageService, reflector);
	}

	protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
		if (await super.shouldSkip(context)) return true;

		const handler = context.getHandler();
		const classRef = context.getClass();
		const targets = [handler, classRef];

		const skippedTier = this.throttlers?.find((t) => {
			if (t.name.startsWith('dedicated-')) return false;
			return this.reflector.getAllAndOverride(`THROTTLER:SKIP${t.name}`, targets);
		});

		if (skippedTier) return true;

		return false;
	}

	protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
		const { throttler } = requestProps;

		if (throttler.name.startsWith('dedicated-')) return true;

		return super.handleRequest(requestProps);
	}
}
