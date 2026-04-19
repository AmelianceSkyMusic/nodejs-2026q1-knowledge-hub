import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger(LoggerMiddleware.name);

	constructor(private readonly configService: ConfigService) {}

	use(req: Request, res: Response, next: NextFunction) {
		res.on('finish', () => {
			const { method, originalUrl } = req;

			if (this.configService.get<string>('SERVER_LOGS') === 'enable') {
				this.logger.log(`[${method}]${originalUrl} — ${res.statusCode} ${res.statusMessage}`);
			}
		});

		next();
	}
}
