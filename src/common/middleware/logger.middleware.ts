import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger(LoggerMiddleware.name);

	use(req: Request, res: Response, next: NextFunction) {
		const startTime = performance.now();

		const requestId = crypto.randomUUID();
		req['id'] = requestId;

		this.logger.log({
			method: req.method,
			url: req.originalUrl,
			query: req.query,
			body: req.body,
			requestId,
			type: 'in',
		});

		res.on('finish', () => {
			const endTime = performance.now();
			const duration = endTime - startTime;

			this.logger.log({
				method: req.method,
				url: req.originalUrl,
				status: res.statusCode,
				time: `${duration.toFixed(2)}ms`,
				requestId,
				type: 'out',
			});
		});

		next();
	}
}
