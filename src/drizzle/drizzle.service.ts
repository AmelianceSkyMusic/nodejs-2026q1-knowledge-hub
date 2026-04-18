import { Injectable, Logger as NestLogger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { relations } from './db/relations';
import * as schema from './db/schema';
import { DrizzleDb } from './types/drizzle-db';

const SQL_KEYWORDS_REGEX =
	/\b(select|from|where|insert into|values|returning|update|set|delete from|inner join|left join|and|or|order by|group by|limit|offset)\b/gi;

class DrizzleLogger implements Logger {
	private readonly logger = new NestLogger('Drizzle');

	logQuery(query: string, params: unknown[]): void {
		const formattedQuery = query.replaceAll(SQL_KEYWORDS_REGEX, '\n  $1');

		const message = `\n[SQL]:${formattedQuery}${
			params.length > 0 ? `\n[Params]:\n${JSON.stringify(params, null, 2)}` : ''
		}`;

		this.logger.verbose(message);
	}
}

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
	public db: DrizzleDb;
	private pool: Pool;

	constructor(configService: ConfigService) {
		const databaseUrl = configService.get<string>('DATABASE_URL');
		const nodeEnv = configService.get<string>('NODE_ENV');
		const isDevelopment = nodeEnv === 'development';

		this.pool = new Pool({
			connectionString: databaseUrl,
			max: 10,
			idleTimeoutMillis: 10000,
		});

		this.db = drizzle({
			client: this.pool,
			schema,
			relations,
			casing: 'snake_case', //* convert all table and column names to snake_case, so we don't to describe it in schema
			logger: isDevelopment ? new DrizzleLogger() : false,
		});
	}

	async onModuleInit() {
		await this.pool.connect();
	}

	async onModuleDestroy() {
		await this.pool.end();
	}
}
