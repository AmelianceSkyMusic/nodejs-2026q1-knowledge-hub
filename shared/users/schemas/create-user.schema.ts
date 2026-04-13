import { z } from 'zod';

import { err } from '../../common/utils/zod/err.util';

import { ERROR } from '../../common/constants/error';
import { USER_DEFAULTS } from '../constants/user-defaults';
import { USER_ROLES } from '../constants/user-role';

import type { UserRole } from '../types/user-role';

/** Request schema without defaults for frontend */
export const CreateUserRequestSchema = z.object({
	login: z.string(err(ERROR.LOGIN.IS_NOT_STRING)).trim().min(1, ERROR.LOGIN.IS_EMPTY),
	password: z.string(err(ERROR.PASSWORD.IS_NOT_STRING)).trim().min(1, ERROR.PASSWORD.IS_EMPTY),
	role: z
		.preprocess((val: string) => val?.toLowerCase(), z.enum(USER_ROLES, err(ERROR.ROLE.INVALID)))
		.transform((val) => val.toUpperCase() as Uppercase<UserRole>)
		.optional(),
});

/** Validated schema with defaults for backend */
export const CreateUserSchema = CreateUserRequestSchema.extend({
	role: CreateUserRequestSchema.shape.role.default(
		USER_DEFAULTS.ROLE.toUpperCase() as Uppercase<UserRole>,
	),
});

/** Request type without defaults for frontend */
export type CreateUserRequest = z.input<typeof CreateUserRequestSchema>;

/** Validated type with defaults for backend */
export type CreateUser = z.output<typeof CreateUserSchema>;
