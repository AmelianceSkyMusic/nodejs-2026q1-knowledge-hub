import 'express';

import type { JwtUser } from 'shared/auth/schemas/jwt-user.schema';

declare global {
	namespace Express {
		interface Request {
			user?: JwtUser;
		}
	}
}
