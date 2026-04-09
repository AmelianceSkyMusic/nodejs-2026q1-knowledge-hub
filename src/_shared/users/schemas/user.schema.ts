import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

import { USER_ROLES } from '../constants/user-role';

export const UserSchema = z.object({
	id: zUuid(),
	login: z.string(),
	role: z.enum(USER_ROLES),
	createdAt: z.number().int().nonnegative(),
	updatedAt: z.number().int().nonnegative(),
});

export type User = z.infer<typeof UserSchema>;
