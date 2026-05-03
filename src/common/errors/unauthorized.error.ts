import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

/**
 * Exception for 401 Unauthorized responses.
 * Used when the request lacks valid authentication credentials.
 */
export class UnauthorizedError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 401,
			errorName: CUSTOM_ERROR.NAMES.UNAUTHORIZED,
		});
	}
}
