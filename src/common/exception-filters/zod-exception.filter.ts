import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import {
	ZodSchemaDeclarationException,
	ZodSerializationException,
	ZodValidationException,
} from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(ZodValidationException, ZodSerializationException, ZodSchemaDeclarationException)
export class ZodExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(ZodExceptionFilter.name);

	catch(
		exception: ZodValidationException | ZodSerializationException | ZodSchemaDeclarationException,
		host: ArgumentsHost,
	) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		if (exception instanceof ZodSchemaDeclarationException) {
			this.logger.error(
				`Zod Schema Declaration Error: ${exception.message}. Hint: check if @ZodDto() is missing in the controller.`,
				exception.stack,
			);
			return response.status(500).json({
				statusCode: 500,
				message: 'Missing nestjs-zod schema declaration (DTO) for parameter',
				error: exception.message,
			});
		}

		const status = exception.getStatus();
		const zodError = exception.getZodError();
		const req = ctx.getRequest();
		const { method, url } = req;

		if (zodError instanceof ZodError) {
			const isValidation = exception instanceof ZodValidationException;
			const issuesList = zodError.issues
				.map((issue) => `  - [${issue.path.join('.') || 'root'}]: ${issue.message}`)
				.join('\n');

			const logMessage = `${isValidation ? 'Validation' : 'Serialization'} Error details:\n${issuesList}`;

			const logData = {
				method,
				url,
				status,
				message: logMessage,
				requestId: req['id'],
				type: 'out',
			};

			if (isValidation) {
				this.logger.warn(logData);
			} else {
				const stack = exception instanceof Error ? exception.stack : '';
				this.logger.error(logData, stack);
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
