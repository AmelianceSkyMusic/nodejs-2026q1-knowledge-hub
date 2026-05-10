export default () => {
	const nodeEnv = process.env.NODE_ENV || 'development';
	const isProduction = nodeEnv === 'production';

	return {
		port: Number(process.env.PORT) || 4000,
		apiPrefix: process.env.API_PREFIX || '',
		nodeEnv,
		isProduction,
		logLevel: process.env.LOG_LEVEL || 'log',
		logMaxFileSize: process.env.LOG_MAX_FILE_SIZE || '10240',
		logDir: 'logs',
		logFile: 'app.log',
		databaseUrl: process.env.DATABASE_URL,
		dbLogs: !isProduction && process.env.DB_LOGS === 'true',
		dbPoolMax: Number(process.env.DB_POOL_MAX) || 20,
		dbPoolIdleTimeout: Number(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
		dbPoolConnectionTimeout: Number(process.env.DB_POOL_CONNECTION_TIMEOUT) || 2000,
		dbPoolMaxUses: Number(process.env.DB_POOL_MAX_USES) || 7500,
		cryptSalt: Number(process.env.CRYPT_SALT) || 10,
		jwt: {
			secret: process.env.JWT_SECRET,
			refreshSecret: process.env.JWT_REFRESH_SECRET,
			accessTtl: process.env.JWT_ACCESS_TTL || '15m',
			refreshTtl: process.env.JWT_REFRESH_TTL || '7d',
		},
		ai: {
			apiKey: process.env.GEMINI_API_KEY,
			model: process.env.GEMINI_MODEL,
			baseUrl: process.env.GEMINI_API_BASE_URL,
			rateLimit: Number(process.env.AI_RATE_LIMIT_RPM) || 20,
			cacheTtlSec: Number(process.env.AI_CACHE_TTL_SEC) || 300,
		},
		rag: {
			provider: process.env.RAG_VECTOR_DB_PROVIDER || 'qdrant',
			url: process.env.RAG_VECTOR_DB_URL || 'http://localhost:6333',
		},
	};
};
