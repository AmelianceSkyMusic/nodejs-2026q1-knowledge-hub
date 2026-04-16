import { Global, Module } from '@nestjs/common';

import { DRIZZLE } from './decorators/drizzle.decorator';
import { DrizzleService } from './drizzle.service';

@Global()
@Module({
	providers: [
		DrizzleService,
		{
			provide: DRIZZLE,
			useFactory: (drizzleService: DrizzleService) => drizzleService.db,
			inject: [DrizzleService],
		},
	],
	exports: [DrizzleService, DRIZZLE],
})
export class DrizzleModule {}
