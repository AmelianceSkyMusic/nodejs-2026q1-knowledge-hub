import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { JwtUser } from 'shared/auth/schemas/jwt-user.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { UserRole } from 'shared/users/types/user-role';
import { InternalServerError } from 'src/common/errors/internal-server.error';

import { TokensRepository } from './repositories/tokens.repository';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class TokensService {
	constructor(
		private readonly configService: ConfigService,
		private readonly tokensRepository: TokensRepository,
	) {}

	async generateTokens(payload: { userId: Id; login: string; role: UserRole }) {
		const accessToken = this.generateAccessToken(payload);
		const refreshToken = this.generateRefreshToken(payload);

		const hashedRefreshToken = await hash(refreshToken, 10);
		await this.tokensRepository.create(payload.userId, hashedRefreshToken);

		return { accessToken, refreshToken };
	}

	verifyAccessToken(token: string) {
		const jwtSecret = this.getJwtSecret();
		return this.verifyToken(token, jwtSecret);
	}

	verifyRefreshToken(token: string) {
		const jwtRefreshSecret = this.getJwtRefreshSecret();
		return this.verifyToken(token, jwtRefreshSecret);
	}

	async removeRefreshToken(userId: Id, token: string) {
		const isValid = await this.validateRefreshToken(userId, token);
		if (!isValid) return false;

		await this.tokensRepository.deleteByUserId(userId);
		return true;
	}

	async validateRefreshToken(userId: Id, token: string) {
		const sessionToken = await this.tokensRepository.findByUserId(userId);
		if (!sessionToken) return false;

		return await compare(token, sessionToken.token);
	}

	private generateAccessToken(payload: { userId: Id; login: string; role: UserRole }) {
		const jwtSecret = this.getJwtSecret();
		const accessTokenExpiresIn =
			this.configService.get<SignOptions['expiresIn']>('jwt.accessTtl');

		return sign(payload, jwtSecret, {
			expiresIn: accessTokenExpiresIn,
		});
	}

	private generateRefreshToken(payload: { userId: Id; login: string; role: UserRole }) {
		const jwtRefreshSecret = this.getJwtRefreshSecret();
		const refreshTokenExpiresIn =
			this.configService.get<SignOptions['expiresIn']>('jwt.refreshTtl');

		return sign(payload, jwtRefreshSecret, {
			expiresIn: refreshTokenExpiresIn,
		});
	}

	private getJwtSecret() {
		const jwtSecret = this.configService.get<string>('jwt.secret');
		if (!jwtSecret) throw new InternalServerError(ERROR.ENV.JWT_SECRET_NOT_FOUND);
		return jwtSecret;
	}

	private getJwtRefreshSecret() {
		const jwtRefreshSecret = this.configService.get<string>('jwt.refreshSecret');
		if (!jwtRefreshSecret) {
			throw new InternalServerError(ERROR.ENV.JWT_REFRESH_SECRET_NOT_FOUND);
		}
		return jwtRefreshSecret;
	}

	private verifyToken(token: string, secret: string) {
		try {
			const payload = verify(token, secret);

			if (
				typeof payload === 'object' &&
				payload !== null &&
				'userId' in payload &&
				'login' in payload &&
				'role' in payload
			) {
				return payload as JwtUser;
			}
		} catch {
			return null;
		}

		return null;
	}
}
