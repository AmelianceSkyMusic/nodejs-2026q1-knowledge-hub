import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

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
