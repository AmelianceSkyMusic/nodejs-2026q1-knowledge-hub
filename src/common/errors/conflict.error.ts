import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

/**
 * Exception for 409 Conflict responses.
 * Used when the request conflicts with the current state of the server (e.g. duplicate record).
 */
export class ConflictError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 409,
			errorName: CUSTOM_ERROR.NAMES.CONFLICT,
		});
	}
}
