import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger(LoggerMiddleware.name);

	use(req: Request, res: Response, next: NextFunction) {
		const start = performance.now();
		const requestId =
			(req.headers['x-request-id'] as string) ||
			(req.headers['x-correlation-id'] as string) ||
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
