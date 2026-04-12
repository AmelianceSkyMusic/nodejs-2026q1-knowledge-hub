import type { Error } from '../../types/error';

export const err = (message: Error, path?: (string | number)[]) => {
	if (path) return { message, path };
	return { message };
};
