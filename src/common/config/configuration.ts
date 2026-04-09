export default () => ({
	port: Number(process.env.PORT) || 4000,
	apiPrefix: process.env.API_PREFIX || '',
	nodeEnv: process.env.NODE_ENV || 'production',
});
