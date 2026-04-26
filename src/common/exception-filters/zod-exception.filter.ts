import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {
	ZodSchemaDeclarationException,
	ZodSerializationException,
	ZodValidationException,
} from 'nestjs-zod';
import { ZodError } from 'zod';

import { AppLogger } from '../app-logger/app-logger.service';

@Catch(ZodValidationException, ZodSerializationException, ZodSchemaDeclarationException)
export class ZodExceptionFilter implements ExceptionFilter {
	constructor(private readonly appLogger: AppLogger) {}

	catch(
		exception: ZodValidationException | ZodSerializationException | ZodSchemaDeclarationException,
		host: ArgumentsHost,
	) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		if (exception instanceof ZodSchemaDeclarationException) {
			this.appLogger.error(
				`Zod Schema Declaration Error: ${exception.message}`,
				exception.stack,
				'ZodExceptionFilter',
			);
			return response.status(500).json({
				statusCode: 500,
				message: 'Missing nestjs-zod schema declaration (DTO) for parameter',
				error: exception.message,
			});
		}

		const status = exception.getStatus();
		const zodError = exception.getZodError();

		if (zodError instanceof ZodError) {
			const isValidation = exception instanceof ZodValidationException;

			const logMessage = `${isValidation ? 'Validation' : 'Serialization'} Error details:`;

			if (isValidation) {
				this.appLogger.warn(
					`${logMessage} ${JSON.stringify(zodError.issues, null, 2)}`,
					'ZodExceptionFilter',
				);
			} else {
				const stack = exception instanceof Error ? exception.stack : '';
				this.appLogger.error(
					`${logMessage} ${JSON.stringify(zodError.issues, null, 2)}`,
					stack,
					'ZodExceptionFilter',
				);
			}

			return response.status(status).json({
				statusCode: status,
				message: isValidation ? 'Validation failed' : 'Response serialization failed',
				errors: zodError.issues,
			});
		}

		return response.status(500).json({
			statusCode: 500,
			message: 'Internal Server Error',
		});
	}
}
