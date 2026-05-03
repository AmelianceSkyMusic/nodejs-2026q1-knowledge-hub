export type GeminiErrorDetail = {
	'@type': string;
	reason?: string;
	domain?: string;
	metadata?: Record<string, string>;
	[key: string]: unknown;
};

export type GeminiError = {
	code: number;
	message: string;
	status: string;
	details?: GeminiErrorDetail[];
};

export type GeminiErrorResponse = {
	error: GeminiError;
};
