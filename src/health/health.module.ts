import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';

@Module({
	controllers: [HealthController],
	imports: [
		TerminusModule.forRoot({
			errorLogStyle: 'pretty',
			gracefulShutdownTimeoutMs: 1000,
		}),
	],
})
export class HealthModule {}
