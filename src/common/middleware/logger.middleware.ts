import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AppLogger } from '../app-logger/app-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private readonly appLogger: AppLogger) {}

	use(req: Request, res: Response, next: NextFunction) {
		const startTime = performance.now();

		const requestId = crypto.randomUUID();
		req['id'] = requestId;

		this.appLogger.verbose(
			{
				method: req.method,
				url: req.originalUrl,
				query: req.query,
				body: req.body,
				requestId,
				type: 'in',
			},
			LoggerMiddleware.name,
		);

		res.on('finish', () => {
			const endTime = performance.now();
			const duration = endTime - startTime;

			this.appLogger.log(
				{
					method: req.method,
					url: req.originalUrl,
					status: res.statusCode,
					time: `${duration.toFixed(2)}ms`,
					requestId,
					type: 'out',
				},
				LoggerMiddleware.name,
			);
		});

		next();
	}
}
