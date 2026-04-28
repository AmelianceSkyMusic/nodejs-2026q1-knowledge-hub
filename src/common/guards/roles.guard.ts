import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from 'shared/users/types/user-role';
import { ForbiddenError } from 'src/common/errors/forbidden.error';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { checkIsPublic } from '../utils/guard';

import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		if (checkIsPublic(this.reflector, context)) return true;

		const { user } = context.switchToHttp().getRequest<Request>();
		if (!user) throw new ForbiddenError(ERROR.ACCESS.ROLE);

		if (user.role === USER_ROLES.ADMIN) return true;

		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles?.length) return false;

		const hasRole = requiredRoles.includes(user.role);
		if (!hasRole) throw new ForbiddenError(ERROR.ACCESS.ROLE);

		return true;
	}
}
