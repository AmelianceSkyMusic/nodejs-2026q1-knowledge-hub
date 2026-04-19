export type PgError = {
	code: string;
	detail?: string;
	table?: string;
	constraint?: string;
};

export const PG_ERROR = {
	UNIQUE_VIOLATION: '23505',
	FOREIGN_KEY_VIOLATION: '23503',
	NOT_NULL_VIOLATION: '23502',
} as const;

export function getPgError(error: unknown): string | undefined {
	if (typeof error !== 'object' || error === null) return undefined;

	if ('code' in error && typeof (error as Record<string, unknown>).code === 'string') {
		return (error as Record<string, unknown>).code as string;
	}

	if ('cause' in error && typeof error.cause === 'object' && error.cause !== null) {
		const cause = error.cause as Record<string, unknown>;
		if (typeof cause.code === 'string') return cause.code;
	}

	return undefined;
}

export function isPgError(error: unknown): error is PgError | { cause: PgError } {
	return getPgError(error) !== undefined;
}

export const pgError = (error: unknown) => {
	const code = getPgError(error);
	return {
		isUniqueViolation: code === PG_ERROR.UNIQUE_VIOLATION,
		isForeignKeyViolation: code === PG_ERROR.FOREIGN_KEY_VIOLATION,
		isNotNullViolation: code === PG_ERROR.NOT_NULL_VIOLATION,
	};
};
