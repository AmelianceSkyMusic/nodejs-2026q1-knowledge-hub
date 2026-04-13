import { z } from 'zod';

import { zTimestamp } from '../../common/utils/zod/z-timestamp.util';
import { zUuid } from '../../common/utils/zod/z-uuid.util';

import { USER_ROLES } from '../constants/user-role';

export const UserSchema = z.object({
	id: zUuid(),
	login: z.string(),
	role: z.enum(USER_ROLES),
	createdAt: zTimestamp(),
	updatedAt: zTimestamp(),
});

export type User = z.infer<typeof UserSchema>;
