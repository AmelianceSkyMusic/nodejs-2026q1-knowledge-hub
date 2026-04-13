import { z } from 'zod';

import { err } from '../../common/utils/zod/err.util';

import { ERROR } from '../../common/constants/error';

/** Request schema without defaults for frontend */
export const UpdatePasswordRequestSchema = z.object({
	oldPassword: z.string(err(ERROR.PASSWORD.IS_NOT_STRING)).min(1, ERROR.PASSWORD.IS_EMPTY),
	newPassword: z.string(err(ERROR.PASSWORD.IS_NOT_STRING)).min(1, ERROR.PASSWORD.IS_EMPTY),
});

/** Validated schema with defaults for backend */
export const UpdatePasswordSchema = UpdatePasswordRequestSchema;

/** Request type without defaults for frontend */
export type UpdatePasswordRequest = z.input<typeof UpdatePasswordRequestSchema>;

/** Validated type with defaults for backend */
export type UpdatePassword = z.output<typeof UpdatePasswordSchema>;
