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
});
