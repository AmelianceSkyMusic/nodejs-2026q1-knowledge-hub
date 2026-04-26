import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

import { AppLogger } from '../app-logger/app-logger.service';
import { AppError } from '../errors/app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly appLogger: AppLogger) {}

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
		const context = CUSTOM_ERROR.CONTEXTS.ALL_EXCEPTION_FILTER;

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

		this.appLogger.error(`${method} ${url} - ${errorMessage}`, stack, context);

		response.status(statusCode).json(responseBody);
	}
}
