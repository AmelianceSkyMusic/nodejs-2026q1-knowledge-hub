import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AppLogger } from 'src/common/app-logger/app-logger.service';

import { relations } from './db/relations';
import * as schema from './db/schema';
import { DrizzleLogger } from './logger/drizzle.logger';
import { DrizzleDb } from './types/drizzle-db';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
	public db: DrizzleDb;
	private pool: Pool;
	private isEnded = false;

	constructor(
		private configService: ConfigService,
		private appLogger: AppLogger,
	) {
		const databaseUrl = this.configService.get<string>('databaseUrl');
		const isDbLogsEnabled = this.configService.get<boolean>('dbLogs');

		const poolMax = this.configService.get<number>('dbPoolMax');
		const poolIdleTimeout = this.configService.get<number>('dbPoolIdleTimeout');
		const poolConnectionTimeout = this.configService.get<number>('dbPoolConnectionTimeout');
		const poolMaxUses = this.configService.get<number>('dbPoolMaxUses');

		this.pool = new Pool({
			connectionString: databaseUrl,
			max: poolMax,
			idleTimeoutMillis: poolIdleTimeout,
			connectionTimeoutMillis: poolConnectionTimeout,
			maxUses: poolMaxUses,
		});

		this.db = drizzle({
			client: this.pool,
			schema,
			relations,
			casing: 'snake_case', //* Convert all table and column names to snake_case, so we don't to describe it in schema
			logger: isDbLogsEnabled ? new DrizzleLogger(this.appLogger) : false,
		});
	}

	async onModuleInit() {
		try {
			await this.pool.connect();
			this.appLogger.log('Database connection established', DrizzleService.name);
		} catch (error) {
			this.appLogger.error('Failed to connect to database', error.stack, DrizzleService.name);
			throw error;
		}
	}

	async onModuleDestroy() {
		//* Prevent calling pool.end() multiple times if both shutdown hooks and manual close are triggered
		if (this.isEnded) return;
		this.isEnded = true;

		try {
			await this.pool.end();
			this.appLogger.log('Database pool closed gracefully', DrizzleService.name);
		} catch (error) {
			this.appLogger.error('Error closing database pool', error.stack, DrizzleService.name);
		}
	}
}
