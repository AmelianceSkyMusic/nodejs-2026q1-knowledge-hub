import { ConsoleLogger, ConsoleLoggerOptions, Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

type RequestLog = {
	method: string;
	url: string;
	query: Record<string, unknown>;
	body: Record<string, unknown>;
	status: number;
	time: string;
};

@Injectable()
export class AppLogger extends ConsoleLogger {
	constructor(private configService: ConfigService) {
		const isProduction = configService.get('nodeEnv') === 'production';
		const logLevel = configService.get<string>('logLevel');

		super('App', {
			json: isProduction,
		} as ConsoleLoggerOptions);

		this.setLogLevels(this.getLevels(logLevel));
	}

	private getLevels(level: string): LogLevel[] {
		const levels: LogLevel[] = ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'];
		const index = levels.indexOf(level as LogLevel);
		return index === -1
			? ['log', 'warn', 'error', 'fatal']
			: (levels.slice(0, index + 1) as LogLevel[]);
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

	private writeToFile(message: unknown, level: LogLevel, context?: string, stack?: string) {
		if (!this.isLevelEnabled(level)) return;

		const logDir = this.configService.get('logDir');
		const filePath = path.join(logDir, this.configService.get('logFile'));

		try {
			if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

			if (fs.existsSync(filePath)) {
				const fileStat = fs.statSync(filePath);
				if (fileStat.size > this.configService.get('logMaxFileSize')) {
					const date = new Date().toISOString().replace(/[:.]/g, '-');
					fs.renameSync(filePath, filePath.replace('.log', `-${date}.log`));
				}
			}

			const sanitizedMessage = this.sanitize(message);

			const logEntry = {
				timestamp: new Date().toISOString(),
				level,
				context,
				message: sanitizedMessage,
				stack,
			};

			fs.appendFileSync(filePath, `${JSON.stringify(logEntry)}\n`);
		} catch (error) {
			super.error('Failed to write log to file', error.stack, 'AppLogger');
		}
	}

	private formatForConsole(message: unknown): unknown {
		const isProduction = this.configService.get('nodeEnv') === 'production';

		if (this.isRequestLog(message) && !isProduction) {
			const { method, url, query, body, status, time } = message;
			return (
				`[${method}] ${url}\n` +
				`   | Query: ${JSON.stringify(query)}\n` +
				`   | Body: ${JSON.stringify(body)}\n` +
				`   | Status: ${status} | Time: ${time}`
			);
		}
		return message;
	}

	private isRequestLog(message: unknown): message is RequestLog {
		return (
			typeof message === 'object' &&
			message !== null &&
			'method' in message &&
			'url' in message &&
			'status' in message
		);
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
