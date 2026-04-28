import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

export class NotFoundError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 404,
			errorName: CUSTOM_ERROR.NAMES.NOT_FOUND,
		});
	}
}
