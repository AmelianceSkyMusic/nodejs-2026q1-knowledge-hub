import { Global, Module } from '@nestjs/common';

import { QDRANT } from './decorators/qdrant.decorator';
import { QdrantService } from './qdrant.service';

@Global()
@Module({
	providers: [
		QdrantService,
		{
			provide: QDRANT,
			useFactory: (qdrantService: QdrantService) => qdrantService.db,
			inject: [QdrantService],
		},
	],
	exports: [QdrantService, QDRANT],
})
export class QdrantModule {}
