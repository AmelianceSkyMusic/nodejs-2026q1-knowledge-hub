import { createParamDecorator } from '@nestjs/common';

import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtUserDto } from 'src/auth/dto/jwt-user.dto';

export const CurrentUser = createParamDecorator(
	(key: keyof JwtUserDto | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request>();
		const user = request.user;

		if (key && user) return user[key];

		return user;
	},
);
