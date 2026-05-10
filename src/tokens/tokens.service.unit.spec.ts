import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { InternalServerError } from 'src/common/errors/internal-server.error';

import { TokensRepository } from './repositories/tokens.repository';
import { TokensService } from './tokens.service';

import { USER_ROLES } from 'shared/users/constants/user-role';

import type { TestingModule } from '@nestjs/testing';

vi.mock('jsonwebtoken', () => ({
	sign: vi.fn().mockReturnValue('mocked-token'),
	verify: vi.fn(),
}));

vi.mock('bcrypt', () => ({
	hash: vi.fn().mockResolvedValue('hashed-token'),
	compare: vi.fn().mockResolvedValue(true),
}));

describe('TokensService', () => {
	let service: TokensService;

	const MOCKED_USER_ID = '0a0875a1-df4f-4715-a666-1d12b26911e8';
	const MOCKED_LOGIN = 'login';
	const MOCKED_ROLE = USER_ROLES.VIEWER;
	const MOCKED_TOKEN = 'mocked-token';

	const payload = {
		userId: MOCKED_USER_ID,
		login: MOCKED_LOGIN,
		role: MOCKED_ROLE,
	};

	const mockConfigService = {
		get: vi.fn() as any,
	};

	const mockTokensRepository = {
		create: vi.fn(),
		deleteByUserId: vi.fn(),
		findByUserId: vi.fn(),
	};

	beforeEach(async () => {
		mockConfigService.get.mockImplementation((key: string) => {
			if (key === 'jwt.secret') return 'secret';
			if (key === 'jwt.refreshSecret') return 'refresh-secret';
			if (key === 'jwt.accessTtl') return '15m';
			if (key === 'jwt.refreshTtl') return '7d';
			return undefined;
		});

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TokensService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: TokensRepository,
					useValue: mockTokensRepository,
				},
			],
		}).compile();

		service = module.get<TokensService>(TokensService);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('generateTokens', () => {
		it('should generate access token and refresh token and save refresh token in repository', async () => {
			const result = await service.generateTokens(payload);

			expect(result).toEqual({
				accessToken: MOCKED_TOKEN,
				refreshToken: MOCKED_TOKEN,
			});

			expect(hash).toHaveBeenCalledWith(MOCKED_TOKEN, 10);
			expect(mockTokensRepository.create).toHaveBeenCalledWith(MOCKED_USER_ID, 'hashed-token');
			expect(sign).toHaveBeenCalledTimes(2);
		});

		it('should throw InternalServerError() if JWT_SECRET is missing', async () => {
			mockConfigService.get.mockImplementation((key: string) => {
				if (key === 'jwt.secret') return undefined;
				return 'val';
			});

			await expect(service.generateTokens(payload)).rejects.toThrow(InternalServerError);
		});

		it('should throw InternalServerError() if JWT_REFRESH_SECRET is missing', async () => {
			mockConfigService.get = vi.fn().mockImplementation((key: string) => {
				if (key === 'jwt.refreshSecret') return undefined;
				return 'secret';
			});

			await expect(service.generateTokens(payload)).rejects.toThrow(InternalServerError);
		});
	});

	describe('verifyAccessToken', () => {
		it('should verify and return payload', () => {
			(verify as any).mockReturnValue(payload);

			const result = service.verifyAccessToken(MOCKED_TOKEN);

			expect(result).toEqual(payload);
			expect(verify).toHaveBeenCalledWith(MOCKED_TOKEN, 'secret');
		});

		it('should return null if verification fails', () => {
			(verify as any).mockImplementation(() => {
				throw new Error();
			});

			const result = service.verifyAccessToken(MOCKED_TOKEN);

			expect(result).toBeNull();
		});

		it('should return null if payload structure is invalid', () => {
			(verify as any).mockReturnValue({ invalid: 'payload' });

			const result = service.verifyAccessToken(MOCKED_TOKEN);

			expect(result).toBeNull();
		});
	});

	describe('verifyRefreshToken', () => {
		it('should verify using refresh secret', () => {
			(verify as any).mockReturnValue(payload);

			const result = service.verifyRefreshToken(MOCKED_TOKEN);

			expect(result).toEqual(payload);
			expect(verify).toHaveBeenCalledWith(MOCKED_TOKEN, 'refresh-secret');
		});
	});

	describe('removeRefreshToken', () => {
		it('should call .removeRefreshToken() and return true if valid', async () => {
			mockTokensRepository.findByUserId.mockResolvedValue({ token: 'hashed-token' });
			mockTokensRepository.deleteByUserId.mockResolvedValue(undefined);

			const result = await service.removeRefreshToken(MOCKED_USER_ID, MOCKED_TOKEN);

			expect(result).toBe(true);
			expect(mockTokensRepository.findByUserId).toHaveBeenCalledWith(MOCKED_USER_ID);
			expect(compare).toHaveBeenCalledWith(MOCKED_TOKEN, 'hashed-token');
			expect(mockTokensRepository.deleteByUserId).toHaveBeenCalledWith(MOCKED_USER_ID);
		});

		it('should return false if token is invalid', async () => {
			mockTokensRepository.findByUserId.mockResolvedValue({ token: 'wrong-hash' });
			(compare as any).mockResolvedValue(false);

			const result = await service.removeRefreshToken(MOCKED_USER_ID, MOCKED_TOKEN);

			expect(result).toBe(false);
			expect(mockTokensRepository.deleteByUserId).not.toHaveBeenCalled();
		});
	});

	describe('validateRefreshToken', () => {
		it('should return true if token is valid', async () => {
			mockTokensRepository.findByUserId.mockResolvedValue({ token: 'hashed-token' });
			(compare as any).mockResolvedValue(true);

			const result = await service.validateRefreshToken(MOCKED_USER_ID, MOCKED_TOKEN);

			expect(result).toBe(true);
			expect(mockTokensRepository.findByUserId).toHaveBeenCalledWith(MOCKED_USER_ID);
			expect(compare).toHaveBeenCalledWith(MOCKED_TOKEN, 'hashed-token');
		});

		it('should return false if session token not found', async () => {
			mockTokensRepository.findByUserId.mockResolvedValue(null);

			const result = await service.validateRefreshToken(MOCKED_USER_ID, MOCKED_TOKEN);

			expect(result).toBe(false);
		});
	});
});
