import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

export class UnprocessableEntityError extends AppError {
	constructor(message: string) {
		super({
			message,
			statusCode: 422,
			errorName: CUSTOM_ERROR.NAMES.UNPROCESSABLE_ENTITY,
		});
	}
}
