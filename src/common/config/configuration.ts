export default () => ({
	port: Number(process.env.PORT) || 4000,
	apiPrefix: process.env.API_PREFIX || '',
	nodeEnv: process.env.NODE_ENV || 'production',
	logLevel: process.env.LOG_LEVEL || 'log',
	logMaxFileSize: process.env.LOG_MAX_FILE_SIZE
		? Number(process.env.LOG_MAX_FILE_SIZE) * 1024
		: 1024 * 1024,
	logDir: 'logs',
	logFile: 'app.log',
	databaseUrl: process.env.DATABASE_URL,
	dbLogs: process.env.DB_LOGS === 'true',
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
	testMode: process.env.TEST_MODE === 'auth',
});
