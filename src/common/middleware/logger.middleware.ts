import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger(LoggerMiddleware.name);

	use(req: Request, res: Response, next: NextFunction) {
		if (req.originalUrl === '/favicon.ico') return next();

		const start = performance.now();
		const requestId =
			(typeof req.headers['x-request-id'] === 'string'
				? req.headers['x-request-id']
				: undefined) ||
			(typeof req.headers['x-correlation-id'] === 'string'
				? req.headers['x-correlation-id']
				: undefined) ||
			crypto.randomUUID();

		req['id'] = requestId;

		this.logger.debug({
			method: req.method,
			url: req.originalUrl,
			query: req.query,
			body: req.body,
			requestId,
			type: 'in',
		});

		res.on('finish', () => {
			const end = performance.now();
			const time = `${(end - start).toFixed(2)}ms`;

			this.logger.log({
				method: req.method,
				url: req.originalUrl,
				status: res.statusCode,
				time,
				requestId,
				userId: req.user?.userId,
				type: 'out',
			});
		});

		next();
	}
}
