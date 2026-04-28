import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

export class InternalServerError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 500,
			errorName: CUSTOM_ERROR.NAMES.INTERNAL_SERVER_ERROR,
		});
	}
}
