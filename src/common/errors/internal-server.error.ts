import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

/**
 * Exception for 500 Internal Server Error responses.
 * Used for unexpected server-side failures.
 */
export class InternalServerError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 500,
			errorName: CUSTOM_ERROR.NAMES.INTERNAL_SERVER_ERROR,
		});
	}
}
