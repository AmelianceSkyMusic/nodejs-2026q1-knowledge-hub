import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule, nativeLoggerOptions } from 'nestjs-pino';
import { join } from 'path';
import pino from 'pino';

@Global()
@Module({
	imports: [
		LoggerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const nestLevel = configService.get<string>('logLevel');
				const logDir = configService.get<string>('logDir');
				const logFile = configService.get<string>('logFile');
				const maxSize = configService.get<string>('logMaxFileSize');
				const isProduction = configService.get<boolean>('isProduction');

				let pinoLevel: pino.Level = 'info';
				if (nestLevel === 'verbose' || nestLevel === 'trace') pinoLevel = 'trace';
				else if (nestLevel === 'debug') pinoLevel = 'debug';
				else if (nestLevel === 'log' || nestLevel === 'info') pinoLevel = 'info';
				else if (nestLevel === 'warn') pinoLevel = 'warn';
				else if (nestLevel === 'error') pinoLevel = 'error';
				else if (nestLevel === 'fatal') pinoLevel = 'fatal';

				const streams: pino.StreamEntry[] = [];

				if (isProduction) {
					streams.push({ stream: process.stdout, level: pinoLevel });
				} else {
					const { default: buildPrettyStream } = await import('pino-pretty');

					const { customPrettifiers, messageFormat } = await import(
						'./utils/pretty-formatter'
					);

					const prettyStream = buildPrettyStream({
						colorize: true,
						sync: true,
						hideObject: true,
						ignore: 'pid,hostname',
						levelFirst: true,
						messageKey: 'message',
						customPrettifiers,
						messageFormat,
					});
					streams.push({ stream: prettyStream, level: pinoLevel });
				}

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

				const { formatters, ...restNativeLoggerOptions } = nativeLoggerOptions;

				return {
					pinoHttp: [
						{
							...restNativeLoggerOptions,
							autoLogging: false,
							level: pinoLevel,
							redact: {
								paths: [
									'req.headers.authorization',
									'req.headers.cookie',
									'message.body.password',
									'message.body.oldPassword',
									'message.body.newPassword',
									'message.body.accessToken',
									'message.body.refreshToken',
									'message.query.token',
									'*.password',
									'*.*.password',
									'*.*.oldPassword',
									'*.*.newPassword',
								],
								censor: '[REDACTED]',
							},
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
