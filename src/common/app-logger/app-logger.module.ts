import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule, nativeLoggerOptions } from 'nestjs-pino';

import { LoggerStream } from './utils/logger-stream';

@Global()
@Module({
	imports: [
		LoggerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const stream = new LoggerStream(configService);

				const nestLevel = configService.get<string>('logLevel');

				let pinoLevel = nestLevel;
				if (nestLevel === 'verbose') pinoLevel = 'trace';
				if (nestLevel === 'log') pinoLevel = 'info';

				return {
					pinoHttp: [
						{
							...nativeLoggerOptions,
							autoLogging: false,
							level: pinoLevel,
						},
						stream,
					],
				};
			},
		}),
	],
	exports: [LoggerModule],
})
export class AppLoggerModule {}
