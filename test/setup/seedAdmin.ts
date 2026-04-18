import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { relations } from '../../src/drizzle/db/relations';
import * as schema from '../../src/drizzle/db/schema';

export const SEED_ADMIN_LOGIN = 'TEST_SEED_ADMIN';
export const SEED_ADMIN_PASSWORD = 'TestSeedAdmin123!';

export default async function globalSetup(): Promise<void> {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	const db = drizzle({
		client: pool,
		schema,
		relations,
		casing: 'snake_case',
	});

	const hashedPassword = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);

	try {
		await db.insert(schema.users).values({
			login: SEED_ADMIN_LOGIN,
			password: hashedPassword,
			role: 'admin',
		}).onConflictDoUpdate({
			target: schema.users.login,
			set: {
				password: hashedPassword,
				role: 'admin',
			},
		})
	} finally {
		await pool.end();
	}
}
