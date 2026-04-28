import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

export class ForbiddenError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 403,
			errorName: CUSTOM_ERROR.NAMES.FORBIDDEN,
		});
	}
}
