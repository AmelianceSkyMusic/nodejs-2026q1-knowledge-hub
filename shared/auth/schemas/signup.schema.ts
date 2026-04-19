import { CreateUserRequestSchema } from 'shared/users/schemas/create-user.schema';

import type z from 'zod';

/** Request schema without defaults for frontend */
export const SignupRequestSchema = CreateUserRequestSchema.pick({
	login: true,
	password: true,
});

/** Validated schema with defaults for backend */
export const SignupSchema = SignupRequestSchema;

/** Request type without defaults for frontend */
export type SignupRequest = z.input<typeof SignupRequestSchema>;

/** Validated type with defaults for backend */
export type Signup = z.output<typeof SignupSchema>;
