import { ilike } from 'drizzle-orm';

import * as schema from '../../src/drizzle/db/schema';
import { drizzle, pool } from '../lib/drizzle';

export default async function globalTeardown(): Promise<void> {
	try {
		await drizzle.delete(schema.articles).where(ilike(schema.articles.title, 'TEST_%'));

		await drizzle.delete(schema.categories).where(ilike(schema.categories.name, 'TEST_%'));

		await drizzle.delete(schema.users).where(ilike(schema.users.login, 'TEST_%'));

		console.log('Cleanup after tests completed!');
	} catch (error) {
		console.error('Error during cleanup after tests:', error);
	} finally {
		await pool.end();
	}
}
