import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule, nativeLoggerOptions } from 'nestjs-pino';
import { join } from 'path';
import pino from 'pino';

import { LoggerStream } from './utils/logger-stream';

@Global()
@Module({
	imports: [
		LoggerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const stream = new LoggerStream(configService);

				const nestLevel = configService.get<string>('logLevel');
				const logDir = configService.get<string>('logDir');
				const logFile = configService.get<string>('logFile');
				const maxSize = configService.get<string>('logMaxFileSize');

				let pinoLevel: pino.Level = 'info';
				if (nestLevel === 'verbose' || nestLevel === 'trace') pinoLevel = 'trace';
				else if (nestLevel === 'debug') pinoLevel = 'debug';
				else if (nestLevel === 'log' || nestLevel === 'info') pinoLevel = 'info';
				else if (nestLevel === 'warn') pinoLevel = 'warn';
				else if (nestLevel === 'error') pinoLevel = 'error';
				else if (nestLevel === 'fatal') pinoLevel = 'fatal';

				const streams: pino.StreamEntry[] = [{ stream, level: pinoLevel }];

				if (logDir && logFile) {
					const fileTransport = pino.transport({
						target: 'pino-roll',
						options: {
							file: join(logDir, logFile),
							size: maxSize ? `${maxSize}k` : undefined,
							frequency: 'daily',
							dateFormat: 'yyyy-MM-dd',
							mkdir: true,
							limit: { count: 365 },
						},
					});
					streams.push({ stream: fileTransport, level: pinoLevel });
				}

				return {
					pinoHttp: [
						{
							...nativeLoggerOptions,
							autoLogging: false,
							level: pinoLevel,
						},
						pino.multistream(streams),
					],
				};
			},
		}),
	],
	exports: [LoggerModule],
})
export class AppLoggerModule {}
