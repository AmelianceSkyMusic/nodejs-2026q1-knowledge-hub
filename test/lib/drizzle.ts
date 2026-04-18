import 'dotenv/config';
import { drizzle as drizzleDb } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { relations } from '../../src/drizzle/db/relations';
import * as schema from '../../src/drizzle/db/schema';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const drizzle = drizzleDb({ client: pool, schema, relations, casing: 'snake_case' });

export default drizzle;
