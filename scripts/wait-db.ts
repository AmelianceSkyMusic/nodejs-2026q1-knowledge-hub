import { loadEnvFile } from 'node:process'; // Нативно в нових версіях
import waitOn from 'wait-on';

try {
	loadEnvFile();
} catch {}

const port = process.env.POSTGRES_PORT || 5432;
console.log(`⏳ Waiting for database on port ${port}...`);

waitOn({ resources: [`tcp:${port}`] })
	.then(() => console.log('✅ Database is ready!'))
	.catch((err) => {
		console.error('❌ Error waiting for database:', err);
		process.exit(1);
	});
