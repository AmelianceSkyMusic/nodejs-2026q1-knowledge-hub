type AppErrorType = {
	message: string;
	statusCode: number;
	errorName: string;
};

export class AppError extends Error {
	readonly statusCode: number;

	constructor({ message, statusCode, errorName }: AppErrorType) {
		super(message);
		this.statusCode = statusCode;
		this.name = errorName;
	}
}
