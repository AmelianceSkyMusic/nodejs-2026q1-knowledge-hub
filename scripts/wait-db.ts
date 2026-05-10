import { loadEnvFile } from 'node:process'; // Нативно в нових версіях
import waitOn from 'wait-on';

try {
	loadEnvFile();
} catch {}

const port = process.env.POSTGRES_PORT || 5432;
const qdrantPort = 6333;
console.log(`⏳ Waiting for database on port ${port}...`);
console.log(`⏳ Waiting for qdrant on port ${qdrantPort}...`);

waitOn({ resources: [`tcp:${port}`, `tcp:${qdrantPort}`], timeout: 30000 })
	.then(() => console.log('✅ All services are ready!'))
	.catch((err) => {
		console.error('❌ Error waiting for database:', err);
		process.exit(1);
	});
