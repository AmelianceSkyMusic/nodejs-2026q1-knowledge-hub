import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

/**
 * Exception for 503 Service Unavailable responses.
 * Used when the server is temporarily unable to handle the request (e.g. overload or maintenance).
 */
export class ServiceUnavailableError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 503,
			errorName: CUSTOM_ERROR.NAMES.SERVICE_UNAVAILABLE,
		});
	}
}
