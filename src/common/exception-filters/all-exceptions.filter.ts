import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppError } from '../errors/app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let statusCode = 500;
		if (exception instanceof AppError) {
			statusCode = exception.statusCode;
		} else if (exception instanceof HttpException) {
			statusCode = exception.getStatus();
		}

		const message =
			exception instanceof HttpException
				? exception.getResponse()
				: exception instanceof Error
					? exception.message
					: CUSTOM_ERROR.MESSAGES.INTERNAL_SERVER_ERROR;

		const stack = exception instanceof Error ? exception.stack : '';

		const isHttpException = exception instanceof HttpException;
		const isInternalError = statusCode === 500;

		let errorName = CUSTOM_ERROR.MESSAGES.INTERNAL_SERVER_ERROR;
		let errorMessage = message;

		if (isHttpException) {
			const res = exception.getResponse();
			if (typeof res === 'object' && res !== null) {
				const nestRes = res as Record<string, unknown>;
				errorName = (nestRes.error as string) || exception.name;
				errorMessage = (nestRes.message as string) || message;
			}
		} else if (exception instanceof Error && !isInternalError) {
			errorName = exception.name;
		}

		const req = ctx.getRequest<Request>();
		const { method, url } = req;

		const responseBody = {
			statusCode,
			error: errorName,
			message:
				isInternalError && !isHttpException
					? CUSTOM_ERROR.MESSAGES.UNEXPECTED_ERROR
					: errorMessage,
		};

		this.logger.error(
			{
				method,
				url,
				status: statusCode,
				message: errorMessage,
				requestId: req['id'],
				userId: req.user?.userId,
				type: 'out',
			},
			stack,
		);

		response.status(statusCode).json(responseBody);
	}
}
