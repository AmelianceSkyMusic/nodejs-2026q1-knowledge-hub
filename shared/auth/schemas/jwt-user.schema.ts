import { UserSchema } from 'shared/users/schemas/user.schema';
import z from 'zod';

export const JwtUserSchema = z.object({
	userId: UserSchema.shape.id,
	login: UserSchema.shape.login,
	role: UserSchema.shape.role,
});

export type JwtUser = z.output<typeof JwtUserSchema>;
