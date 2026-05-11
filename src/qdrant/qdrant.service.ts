import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';

@Injectable()
export class QdrantService implements OnModuleInit {
	public db: QdrantClient;
	private readonly logger = new Logger(QdrantService.name);

	constructor(private configService: ConfigService) {
		const ragConfig = this.configService.get('rag');

		this.db = new QdrantClient({ url: ragConfig.url });
	}

	async onModuleInit() {
		try {
			await this.db.getCollections();
			this.logger.log('Qdrant connection established');
		} catch (error) {
			this.logger.error('Failed to connect to Qdrant', error.stack);
			throw error;
		}
	}
}
