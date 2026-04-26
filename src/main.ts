import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from './app.module';
import { AppLogger } from './common/app-logger/app-logger.service';
import { AllExceptionsFilter } from './common/exception-filters/all-exceptions.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});

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

	const configService = app.get(ConfigService);

	const apiPrefix = configService.get<string>('apiPrefix');
	if (apiPrefix) app.setGlobalPrefix(apiPrefix);

	app.useLogger(app.get(AppLogger));
	app.useGlobalFilters(new AllExceptionsFilter(app.get(AppLogger)));

	const port = configService.get<number>('port');

	if (!port) throw new Error('PORT environment variable is missing');

	await app.listen(port);

	const appLogger = app.get(AppLogger);

	appLogger.debug(
		`\n  > Application is running on: http://localhost:${port}/${apiPrefix}`,
		'Bootstrap',
	);
}
bootstrap();
