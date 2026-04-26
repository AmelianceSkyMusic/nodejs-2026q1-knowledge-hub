import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

export class ForbiddenError extends AppError {
	constructor(message: string) {
		super(message);
		this.statusCode = 403;
		this.name = CUSTOM_ERROR.ERROR_NAMES.FORBIDDEN;
	}
}
