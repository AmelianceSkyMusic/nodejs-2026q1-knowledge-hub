import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokensService } from 'src/tokens/tokens.service';

import { checkIsPublic } from '../utils/guard';

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
		const url = request.url;
		if (url === '/' || url.startsWith('/doc')) return true;

		const token = request.headers.authorization;
		if (!token) throw new UnauthorizedException(ERROR.TOKEN.INVALID);

		const [type, accessToken] = token.split(' ');
		if (type !== 'Bearer') throw new UnauthorizedException(ERROR.TOKEN.INVALID);

		const payload = this.tokensService.verifyAccessToken(accessToken);
		if (!payload) throw new UnauthorizedException(ERROR.TOKEN.INVALID);

		request.user = payload;

		return true;
	}
}
