import z from 'zod';

export const zTimestamp = () =>
	z.preprocess(
		(val) => (val instanceof Date ? val.getTime() : val),
		z.number().int().nonnegative(),
	);
