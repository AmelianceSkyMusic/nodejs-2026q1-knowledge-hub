import { applyDecorators, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { AiThrottlerGuard } from '../guards/ai-throttler.guard';

export function AiThrottle() {
	return applyDecorators(
		SkipThrottle({
			short: true,
			medium: true,
			long: true,
		}),
		UseGuards(AiThrottlerGuard),
	);
}
