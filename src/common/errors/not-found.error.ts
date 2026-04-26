import { AppError } from './app.error';

import { CUSTOM_ERROR } from '../constants/custom-error';

export class NotFoundError extends AppError {
	constructor(message: string) {
		super(message);
		this.statusCode = 404;
		this.name = CUSTOM_ERROR.ERROR_NAMES.NOT_FOUND;
	}
}
