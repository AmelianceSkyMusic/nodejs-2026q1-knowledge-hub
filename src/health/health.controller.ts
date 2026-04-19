import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private memory: MemoryHealthIndicator,
	) {}

	@Get()
	@Public()
	@ApiOperation({
		summary: 'Health check',
		description: 'Health check',
		security: [],
	})
	@HealthCheck()
	check() {
		return this.health.check([() => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024)]);
	}
}
