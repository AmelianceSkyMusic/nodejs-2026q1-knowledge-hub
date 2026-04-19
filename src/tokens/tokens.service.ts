import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { Id } from 'shared/common/schemas/id.schema';
import { UserRole } from 'shared/users/types/user-role';

import { JwtPayload } from './types/jwt-payload';

import { ERROR } from 'shared/common/constants/error';

@Injectable()
export class TokensService {
	constructor(private readonly configService: ConfigService) {}

	generateTokens(payload: { userId: Id; login: string; role: UserRole }) {
		const accessToken = this.generateAccessToken(payload);
		const refreshToken = this.generateRefreshToken(payload);
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

	private generateAccessToken(payload: { userId: Id; login: string; role: UserRole }) {
		const jwtSecret = this.getJwtSecret();
		const accessTokenExpiresIn =
			this.configService.get<SignOptions['expiresIn']>('JWT_ACCESS_TTL') || '15m';

		return sign(payload, jwtSecret, {
			expiresIn: accessTokenExpiresIn,
		});
	}

	private generateRefreshToken(payload: { userId: Id; login: string; role: UserRole }) {
		const jwtRefreshSecret = this.getJwtRefreshSecret();
		const refreshTokenExpiresIn =
			this.configService.get<SignOptions['expiresIn']>('JWT_REFRESH_TTL') || '7d';

		return sign(payload, jwtRefreshSecret, {
			expiresIn: refreshTokenExpiresIn,
		});
	}

	private getJwtSecret() {
		const jwtSecret = this.configService.get<string>('JWT_SECRET');
		if (!jwtSecret) throw new InternalServerErrorException(ERROR.ENV.JWT_SECRET_NOT_FOUND);
		return jwtSecret;
	}

	private getJwtRefreshSecret() {
		const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
		if (!jwtRefreshSecret) {
			throw new InternalServerErrorException(ERROR.ENV.JWT_REFRESH_SECRET_NOT_FOUND);
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
				return payload as JwtPayload;
			}
		} catch {
			throw new ForbiddenException(ERROR.TOKEN.INVALID);
		}

		throw new ForbiddenException(ERROR.TOKEN.INVALID);
	}
}
