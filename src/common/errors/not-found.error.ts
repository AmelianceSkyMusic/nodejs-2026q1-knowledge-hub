import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

/**
 * Exception for 404 Not Found responses.
 * Used when the requested resource cannot be found on the server.
 */
export class NotFoundError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 404,
			errorName: CUSTOM_ERROR.NAMES.NOT_FOUND,
		});
	}
}
