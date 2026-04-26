import { OptionalThrottlerGuard } from './optional-throttler.guard';

import type { ExecutionContext } from '@nestjs/common';

class TestGuard extends OptionalThrottlerGuard {
	constructor() {
		super({} as any, {} as any, {} as any);
	}

	public async testShouldSkip() {
		return this.shouldSkip({} as ExecutionContext);
	}
}

describe('OptionalThrottlerGuard', () => {
	let guard: TestGuard;
	beforeEach(() => {
		guard = new TestGuard();
		vi.unstubAllEnvs();
	});

	it('should skip (return true) if not in production', async () => {
		vi.stubEnv('NODE_ENV', 'development');

		const result = await guard.testShouldSkip();

		expect(result).toBe(true);
	});

	it('should not skip (return false) if in production and TEST_MODE is not auth', async () => {
		vi.stubEnv('NODE_ENV', 'production');
		vi.stubEnv('TEST_MODE', '');

		const result = await guard.testShouldSkip();

		expect(result).toBe(false);
	});
});
