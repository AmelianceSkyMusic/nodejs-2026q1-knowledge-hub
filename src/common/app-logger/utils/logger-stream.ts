import { ConsoleLogger } from '@nestjs/common';
import { Writable } from 'stream';

import { isRequestLog } from '../types/request-log';
import { RotatingStream } from './rotating-stream';

import type { ConsoleLoggerOptions, LogLevel } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

export class LoggerStream extends Writable {
	private consoleLogger: ConsoleLogger;
	private rotatingStream: RotatingStream | null = null;
	private configService: ConfigService;
	private enabledLevels: Set<LogLevel>;

	constructor(configService: ConfigService) {
		super();
		this.configService = configService;
		const isProduction = configService.get<boolean>('isProduction');
		const logLevel = configService.get<string>('logLevel');

		this.consoleLogger = new ConsoleLogger('App', {
			json: isProduction,
		} as ConsoleLoggerOptions);

		const levels = this.getLevels(logLevel || 'log');
		this.enabledLevels = new Set(levels);
		this.consoleLogger.setLogLevels(levels);

		const logDir = configService.get<string>('logDir');
		const logFile = configService.get<string>('logFile');
		const maxSize = configService.get<number>('logMaxFileSize');

		if (logDir && logFile && maxSize) {
			this.rotatingStream = new RotatingStream(logDir, logFile, maxSize);
		}
	}

	private getLevels(targetLevel: string): LogLevel[] {
		const ALL_LEVELS: LogLevel[] = ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'];
		const index = ALL_LEVELS.indexOf(targetLevel as LogLevel);
		if (index === -1) return ['fatal', 'error', 'warn', 'log'];
		return ALL_LEVELS.slice(0, index + 1);
	}

	_write(chunk: any, _encoding: any, callback: any) {
		try {
			const logObj = JSON.parse(chunk.toString());

			const level = (logObj.level as LogLevel) || 'log';
			const context = logObj.context || 'App';
			const messageObj = logObj.message;
			const stack = logObj.stack;

			const requestId = logObj.req?.id;
			const isProduction = this.configService.get<boolean>('isProduction');

			const message = messageObj;
			if (requestId && typeof message === 'object' && message !== null) {
				message.requestId = requestId;
			}

			const sanitized = this.sanitize(message);
			const formatted = this.formatForConsole(sanitized);

			if (this.isLevelEnabled(level)) {
				const formattedStack =
					!isProduction && stack
						? `   | Stack: ${stack.toString().replace(/\n/g, '\n   |')}`
						: stack;

				if (level === 'error' || level === 'fatal') {
					this.consoleLogger[level](formatted, formattedStack, context);
				} else {
					this.consoleLogger[level](formatted, context);
				}
				this.writeToFile(sanitized, level, context, stack, requestId, logObj.timestamp);
			}
		} catch (err) {
			this.consoleLogger.error(
				'Failed to parse log chunk',
				err instanceof Error ? err.stack : undefined,
				'AppLoggerStream',
			);
		} finally {
			callback();
		}
	}

	private isLevelEnabled(level: string): boolean {
		return this.enabledLevels.has(level as LogLevel);
	}

	private writeToFile(
		message: unknown,
		level: string,
		context?: string,
		stack?: string,
		requestId?: string,
		timestamp?: number,
	) {
		if (!this.rotatingStream) return;

		const logEntry = {
			timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
			level: level.toUpperCase(),
			context: context || 'App',
			requestId,
			message: typeof message === 'object' && message !== null ? message : { msg: message },
			stack: stack || undefined,
		};

		this.rotatingStream.write(`${JSON.stringify(logEntry)}\n`);
	}

	private formatForConsole(message: unknown): unknown {
		const isProduction = this.configService.get('isProduction');

		if (!isRequestLog(message) || isProduction) return message;

		const { method, url, type, requestId } = message;
		const arrow = type === 'in' ? '-->' : '<--';

		if (type === 'in') {
			const { query, body } = message;
			const queryStr =
				query && Object.keys(query).length > 0
					? `\n   | Query: ${JSON.stringify(query, null, 2).replace(/\n/g, '\n   | ')}`
					: '';
			const bodyStr =
				body && Object.keys(body).length > 0
					? `\n   | Body: ${JSON.stringify(body, null, 2).replace(/\n/g, '\n   | ')}`
					: '';

			return `${arrow} [${method}] ${url} [id: ${requestId}]${queryStr}${bodyStr}`;
		} else {
			const { status, time, message: msg } = message;
			const timeStr = time ? ` | Time: ${time}` : '';
			const msgStr = msg ? `\n   | Message: ${msg.toString().replace(/\n/g, '\n   | ')}` : '';
			return `${arrow} [${method}] ${url} | Status: ${status}${timeStr} [id: ${requestId}]${msgStr}`;
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
