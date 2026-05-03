import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

/**
 * Exception for validation errors (usually 400 or 422).
 * Used to provide detailed information about which fields failed validation.
 */
export class ValidationError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 400,
			errorName: CUSTOM_ERROR.NAMES.VALIDATION,
		});
	}
}
