import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import {
	ZodSchemaDeclarationException,
	ZodSerializationException,
	ZodValidationException,
} from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(ZodValidationException, ZodSerializationException, ZodSchemaDeclarationException)
export class ZodExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger('ZodExceptionFilter');

	catch(
		exception: ZodValidationException | ZodSerializationException | ZodSchemaDeclarationException,
		host: ArgumentsHost,
	) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		if (exception instanceof ZodSchemaDeclarationException) {
			this.logger.error(`Zod Schema Declaration Error: ${exception.message}`);
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
				this.logger.warn(`${logMessage} ${JSON.stringify(zodError.issues, null, 2)}`);
			} else {
				this.logger.error(`${logMessage} ${JSON.stringify(zodError.issues, null, 2)}`);
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
