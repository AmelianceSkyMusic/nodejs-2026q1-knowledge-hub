import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

export class ConflictError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 409,
			errorName: CUSTOM_ERROR.NAMES.CONFLICT,
		});
	}
}
