import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { NativeLogger } from 'nestjs-pino';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});

	const configService = app.get(ConfigService);

	const isProduction = configService.get<boolean>('isProduction');

	app.enableCors({
		origin: isProduction ? configService.get('FRONTEND_URL') : true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});

	const appLogger = app.get(NativeLogger);

	app.useLogger(appLogger);
	app.flushLogs();

	const apiPrefix = configService.get<string>('apiPrefix');
	if (apiPrefix) app.setGlobalPrefix(apiPrefix);

	const gracefulExit = async (error: Error, type: string) => {
		appLogger.fatal(`${type}: ${error.message}`, error.stack, 'Process');

		const shutdownTimeout = isProduction ? 10000 : 0;

		try {
			await Promise.race([
				app.close(),
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error('Shutdown timeout')), shutdownTimeout),
				),
			]);
		} catch (err) {
			appLogger.error(
				`Error during forced shutdown: ${err instanceof Error ? err.message : String(err)}`,
				'',
				'Process',
			);
		} finally {
			process.exit(1);
		}
	};

	process.on('uncaughtException', (err) => gracefulExit(err, 'Uncaught Exception'));
	process.on('unhandledRejection', (reason) =>
		gracefulExit(
			reason instanceof Error ? reason : new Error(String(reason)),
			'Unhandled Rejection',
		),
	);

	if (isProduction) {
		app.enableShutdownHooks();
	} else {
		process.on('SIGINT', () => process.exit(0));
		process.on('SIGTERM', () => process.exit(0));
	}

	const config = new DocumentBuilder()
		.setTitle('Knowledge Hub')
		.setDescription('Knowledge hub service for managing articles, categories, and comments')
		.setVersion('1.0')
		.addTag('Auth')
		.addTag('User')
		.addTag('Article')
		.addTag('Category')
		.addTag('Comment')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				description: 'Enter JWT Access Token',
			},
			'bearer',
		)
		.addSecurityRequirements('bearer')
		.build();

	const documentFactory = () =>
		cleanupOpenApiDoc(
			SwaggerModule.createDocument(app, config, {
				operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
			}),
		);

	SwaggerModule.setup('doc/swagger', app, documentFactory, {
		jsonDocumentUrl: 'doc/json',
		yamlDocumentUrl: 'doc/yaml',
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	app.use(
		'/doc',
		apiReference({
			content: documentFactory(),
		}),
	);

	const port = configService.get<number>('port');

	if (!port) throw new Error('PORT environment variable is missing');

	await app.listen(port);

	appLogger.debug(
		`> Application is running on: http://localhost:${port}/${apiPrefix}`,
		'Bootstrap',
	);
}

bootstrap();
