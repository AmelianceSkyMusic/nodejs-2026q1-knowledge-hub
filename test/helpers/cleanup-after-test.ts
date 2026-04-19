import { ilike } from 'drizzle-orm';

import * as schema from '../../src/drizzle/db/schema';
import { drizzle, pool } from '../lib/drizzle';

async function cleanupAfterTest() {
	console.log('   🧹 Starting deep cleanup of test data...');

	const deletedArticles = await drizzle
		.delete(schema.articles)
		.where(ilike(schema.articles.title, 'TEST_%'))
		.returning({ id: schema.articles.id });

	if (deletedArticles.length > 0) {
		console.log(`   ✅ Deleted ${deletedArticles.length} test articles`);
	}

	const deletedCategories = await drizzle
		.delete(schema.categories)
		.where(ilike(schema.categories.name, 'TEST_%'))
		.returning({ id: schema.categories.id });

	if (deletedCategories.length > 0) {
		console.log(`   ✅ Deleted ${deletedCategories.length} test categories`);
	}

	const deletedUsers = await drizzle
		.delete(schema.users)
		.where(ilike(schema.users.login, 'TEST_%'))
		.returning({ id: schema.users.id });

	if (deletedUsers.length > 0) {
		console.log(`   ✅ Deleted ${deletedUsers.length} test users`);
	}

	console.log('   ✨ Cleanup finished');
	await pool.end();
}

cleanupAfterTest().catch((e) => {
	console.error(e);
	process.exit(1);
});
