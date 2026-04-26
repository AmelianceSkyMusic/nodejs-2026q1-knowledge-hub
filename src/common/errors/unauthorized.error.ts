import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

export class UnauthorizedError extends AppError {
	constructor(message: string) {
		super(message);
		this.statusCode = 401;
		this.name = CUSTOM_ERROR.ERROR_NAMES.UNAUTHORIZED;
	}
}
