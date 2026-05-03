import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

/**
 * Exception for 422 Unprocessable Entity responses.
 * Used when the server understands the request but cannot process it (e.g. semantic errors).
 */
export class UnprocessableEntityError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 422,
			errorName: CUSTOM_ERROR.NAMES.UNPROCESSABLE_ENTITY,
		});
	}
}
