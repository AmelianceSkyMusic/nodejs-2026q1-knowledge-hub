import { SignupRequestSchema } from './signup.schema';

import type z from 'zod';

/** Request schema without defaults for frontend */
export const LoginRequestSchema = SignupRequestSchema;

/** Validated schema with defaults for backend */
export const LoginSchema = LoginRequestSchema;

/** Request type without defaults for frontend */
export type LoginRequest = z.input<typeof LoginRequestSchema>;

/** Validated type with defaults for backend */
export type Login = z.output<typeof LoginSchema>;
