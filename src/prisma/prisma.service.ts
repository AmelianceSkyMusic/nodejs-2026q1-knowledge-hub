import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	constructor(configService: ConfigService) {
		const databaseUrl = configService.get<string>('DATABASE_URL');
		const nodeEnv = configService.get<string>('NODE_ENV');
		const isDevelopment = nodeEnv === 'development';

		const adapter = new PrismaPg({
			connectionString: databaseUrl,
			max: 10,
			idleTimeoutMillis: 10000,
		});

		super({
			adapter,
			log: isDevelopment ? ['query', 'info', 'warn', 'error'] : ['error'],
			errorFormat: 'pretty',
		});
	}

	async onModuleInit() {
		await this.$connect();
	}
	async onModuleDestroy() {
		await this.$disconnect();
	}
}
