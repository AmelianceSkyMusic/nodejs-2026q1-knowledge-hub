import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

export class BadRequestError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 400,
			errorName: CUSTOM_ERROR.NAMES.BAD_REQUEST,
		});
	}
}
