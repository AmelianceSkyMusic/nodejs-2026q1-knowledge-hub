import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { Login } from 'shared/auth/schemas/login.schema';
import { Refresh } from 'shared/auth/schemas/refresh.schema';
import { Signup } from 'shared/auth/schemas/signup.schema';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { UnauthorizedError } from 'src/common/errors/unauthorized.error';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';

import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tokensService: TokensService,
	) {}

	async signup(signup: Signup) {
		return await this.usersService.createWithSignup({ ...signup, role: USER_ROLES.VIEWER });
	}

	async login(login: Login) {
		const user = await this.usersService.findOneByLoginWithPassword(login.login);
		if (!user || !(await compare(login.password, user.password))) {
			throw new ForbiddenError(ERROR.AUTH.INVALID_LOGIN_OR_PASSWORD);
		}

		return this.tokensService.generateTokens({
			userId: user.id,
			login: user.login,
			role: user.role,
		});
	}

	async refresh(refresh: Refresh) {
		if (!refresh.refreshToken) throw new UnauthorizedError(ERROR.TOKEN.EMPTY);

		const payload = this.tokensService.verifyRefreshToken(refresh.refreshToken);
		if (!payload) throw new ForbiddenError(ERROR.TOKEN.INVALID);

		const isValid = await this.tokensService.validateRefreshToken(
			payload.userId,
			refresh.refreshToken,
		);
		if (!isValid) throw new ForbiddenError(ERROR.TOKEN.INVALID);

		const user = await this.usersService.findOne(payload.userId);
		if (!user) throw new ForbiddenError(ERROR.TOKEN.INVALID);

		return this.tokensService.generateTokens({
			userId: user.id,
			login: user.login,
			role: user.role,
		});
	}

	async logout(refresh: Refresh) {
		if (!refresh.refreshToken) throw new UnauthorizedError(ERROR.TOKEN.EMPTY);

		const payload = this.tokensService.verifyRefreshToken(refresh.refreshToken);
		if (!payload) throw new ForbiddenError(ERROR.TOKEN.INVALID);

		await this.tokensService.removeRefreshToken(payload.userId, refresh.refreshToken);
	}
}
