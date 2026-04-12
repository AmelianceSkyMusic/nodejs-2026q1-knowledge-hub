import { CreateUserRequestSchema } from './create-user.schema';

import type { z } from 'zod';

/** Request schema without defaults for frontend */
export const UpdateUserRequestSchema = CreateUserRequestSchema.partial();

/** Validated schema with defaults for backend */
export const UpdateUserSchema = UpdateUserRequestSchema;

/** Request type without defaults for frontend */
export type UpdateUserRequest = z.input<typeof UpdateUserRequestSchema>;

/** Validated type with defaults for backend */
export type UpdateUser = z.output<typeof UpdateUserSchema>;
