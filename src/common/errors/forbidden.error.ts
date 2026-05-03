import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

/**
 * Exception for 403 Forbidden responses.
 * Used when the user is authenticated but does not have permission to access the resource.
 */
export class ForbiddenError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 403,
			errorName: CUSTOM_ERROR.NAMES.FORBIDDEN,
		});
	}
}
