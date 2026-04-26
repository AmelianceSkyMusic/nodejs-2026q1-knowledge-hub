import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UnauthorizedError } from 'src/common/errors/unauthorized.error';
import { TokensService } from 'src/tokens/tokens.service';

import { checkIsPublic, checkIsSystemPublicPath } from '../utils/guard';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly tokensService: TokensService,
		private readonly reflector: Reflector,
	) {}

	canActivate(context: ExecutionContext): boolean {
		if (checkIsPublic(this.reflector, context)) return true;

		const request = context.switchToHttp().getRequest();
		if (checkIsSystemPublicPath(request.url)) return true;

		const token = request.headers.authorization;
		if (!token) throw new UnauthorizedError(ERROR.TOKEN.INVALID);

		const [type, accessToken] = token.split(' ');
		if (type !== 'Bearer') throw new UnauthorizedError(ERROR.TOKEN.INVALID);

		const payload = this.tokensService.verifyAccessToken(accessToken);
		if (!payload) throw new UnauthorizedError(ERROR.TOKEN.INVALID);

		request.user = payload;

		return true;
	}
}
