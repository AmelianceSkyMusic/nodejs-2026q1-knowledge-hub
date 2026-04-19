import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class OptionalThrottlerGuard extends ThrottlerGuard {
	protected async shouldSkip(_context: ExecutionContext): Promise<boolean> {
		return process.env.NODE_ENV !== 'production' || process.env.TEST_MODE === 'auth';
	}
}
