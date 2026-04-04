import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('Knowledge Hub')
		.setDescription('Knowledge hub service for managing articles, categories, and comments')
		.setVersion('1.0')
		.addTag('User')
		.addTag('Article')
		.addTag('Category')
		.addTag('Comment')
		.build();
	const documentFactory = () =>
		SwaggerModule.createDocument(app, config, {
			operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
		});
	SwaggerModule.setup('doc', app, documentFactory, {
		jsonDocumentUrl: 'doc/json',
		yamlDocumentUrl: 'doc/yaml',
	});

	const configService = app.get(ConfigService);

	const apiPrefix = configService.get<string>('apiPrefix');
	if (apiPrefix) app.setGlobalPrefix(apiPrefix);

	const port = configService.get<number>('port');

	if (!port) throw new Error('PORT environment variable is missing');

	await app.listen(port);

	const logger = new Logger('Bootstrap');

	logger.debug(`\n  > Application is running on: http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
