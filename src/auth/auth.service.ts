import { ForbiddenException, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';

import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { SignupDto } from './dto/signup.dto';

import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tokensService: TokensService,
	) {}

	async signup(signupDto: SignupDto) {
		return await this.usersService.createWithSignup({ ...signupDto, role: USER_ROLES.VIEWER });
	}

	async login(loginDto: LoginDto) {
		const user = await this.usersService.findOneByLoginWithPassword(loginDto.login);
		if (!user || !(await compare(loginDto.password, user.password))) {
			throw new ForbiddenException(ERROR.AUTH.INVALID_LOGIN_OR_PASSWORD);
		}

		return this.tokensService.generateTokens({
			userId: user.id,
			login: user.login,
			role: user.role,
		});
	}

	async refresh(refreshDto: RefreshDto) {
		const payload = this.tokensService.verifyRefreshToken(refreshDto.refreshToken);
		if (!payload) throw new ForbiddenException(ERROR.TOKEN.INVALID);

		const user = await this.usersService.findOne(payload.userId);
		if (!user) throw new ForbiddenException(ERROR.TOKEN.INVALID);

		return this.tokensService.generateTokens({
			userId: user.id,
			login: user.login,
			role: user.role,
		});
	}
}
