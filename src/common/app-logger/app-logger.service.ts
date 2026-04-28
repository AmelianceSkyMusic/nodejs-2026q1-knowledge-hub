import {
	ConsoleLogger,
	ConsoleLoggerOptions,
	Injectable,
	LogLevel,
	OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RotatingStream } from '../utils/rotating-stream';
import { isRequestLog } from './types/request-log';

@Injectable()
export class AppLogger extends ConsoleLogger implements OnModuleDestroy {
	private rotatingStream: RotatingStream | null = null;

	constructor(private configService: ConfigService) {
		const isProduction = configService.get('nodeEnv') === 'production';
		const logLevel = configService.get<string>('logLevel');

		super('App', {
			json: isProduction,
		} as ConsoleLoggerOptions);

		this.setLogLevels(this.getLevels(logLevel));

		const logDir = configService.get<string>('logDir');
		const logFile = configService.get<string>('logFile');
		const maxSize = configService.get<number>('logMaxFileSize');

		if (logDir && logFile) {
			this.rotatingStream = new RotatingStream(logDir, logFile, maxSize);
		}
	}

	onModuleDestroy() {
		this.rotatingStream?.end();
	}

	log(message: unknown, context?: string) {
		const sanitized = this.sanitize(message);
		const formatted = this.formatForConsole(sanitized);
		super.log(formatted, context);
		this.writeToFile(sanitized, 'log', context);
	}

	warn(message: unknown, context?: string) {
		const sanitized = this.sanitize(message);
		const formatted = this.formatForConsole(sanitized);
		super.warn(formatted, context);
		this.writeToFile(sanitized, 'warn', context);
	}

	error(message: unknown, stack?: string, context?: string) {
		const sanitized = this.sanitize(message);
		const formatted = this.formatForConsole(sanitized);
		super.error(formatted, stack, context);
		this.writeToFile(sanitized, 'error', context, stack);
	}

	debug(message: unknown, context?: string) {
		const sanitized = this.sanitize(message);
		const formatted = this.formatForConsole(sanitized);
		super.debug(formatted, context);
		this.writeToFile(sanitized, 'debug', context);
	}

	verbose(message: unknown, context?: string) {
		const sanitized = this.sanitize(message);
		const formatted = this.formatForConsole(sanitized);
		super.verbose(formatted, context);
		this.writeToFile(sanitized, 'verbose', context);
	}

	fatal(message: unknown, stack?: string, context?: string) {
		const sanitized = this.sanitize(message);
		const formatted = this.formatForConsole(sanitized);
		super.fatal(formatted, stack, context);
		this.writeToFile(sanitized, 'fatal', context, stack);
	}

	private getLevels(targetLevel: string): LogLevel[] {
		const ALL_LEVELS: LogLevel[] = ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'];
		const index = ALL_LEVELS.indexOf(targetLevel as LogLevel);
		if (index === -1) return ['fatal', 'error', 'warn', 'log'];
		return ALL_LEVELS.slice(0, index + 1);
	}

	private writeToFile(message: unknown, level: LogLevel, context?: string, stack?: string) {
		if (!this.rotatingStream || !this.isLevelEnabled(level)) return;

		const logEntry = {
			timestamp: new Date().toISOString(),
			level: level.toUpperCase(),
			context: context || 'App',
			requestId: isRequestLog(message) ? message.requestId : undefined,
			message: typeof message === 'object' && message !== null ? message : { msg: message },
			stack: stack || undefined,
		};

		this.rotatingStream.write(`${JSON.stringify(logEntry)}\n`);
	}

	private formatForConsole(message: unknown): unknown {
		const isProduction = this.configService.get('nodeEnv') === 'production';

		if (!isRequestLog(message) || isProduction) return message;

		const { method, url, type, requestId } = message;
		const arrow = type === 'in' ? '-->' : '<--';

		if (type === 'in') {
			const { query, body } = message;
			return (
				`${arrow} [${method}] ${url} (ID: ${requestId})\n` +
				`   | Query: ${JSON.stringify(query)}\n` +
				`   | Body: ${JSON.stringify(body)}`
			);
		} else {
			const { status, time } = message;
			return `${arrow} [${method}] ${url} | Status: ${status} | Time: ${time} (ID: ${requestId})`;
		}
	}

	private sanitize(data: unknown): unknown {
		if (!data || typeof data !== 'object') return data;

		if (Array.isArray(data)) {
			return data.map((item) => this.sanitize(item));
		}

		const sanitized = { ...(data as Record<string, unknown>) };
		const sensitiveKeys = ['password', 'token', 'secret', 'authorization'];

		for (const key in sanitized) {
			if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
				sanitized[key] = '[REDACTED]';
			} else if (typeof sanitized[key] === 'object') {
				sanitized[key] = this.sanitize(sanitized[key]);
			}
		}
		return sanitized;
	}
}
