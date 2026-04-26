import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { sign, verify } from 'jsonwebtoken';

import { TokensRepository } from './repositories/tokens.repository';
import { TokensService } from './tokens.service';

import { USER_ROLES } from 'shared/users/constants/user-role';

import type { TestingModule } from '@nestjs/testing';

vi.mock('jsonwebtoken', () => ({
	sign: vi.fn().mockReturnValue('mocked-token'),
	verify: vi.fn(),
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
		validate: vi.fn(),
	};

	beforeEach(async () => {
		mockConfigService.get.mockImplementation((key: string) => {
			if (key === 'JWT_SECRET') return 'secret';
			if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
			if (key === 'JWT_ACCESS_TTL') return '15m';
			if (key === 'JWT_REFRESH_TTL') return '7d';
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

			expect(mockTokensRepository.create).toHaveBeenCalledWith(MOCKED_USER_ID, MOCKED_TOKEN);
			expect(sign).toHaveBeenCalledTimes(2);
		});

		it('should throw InternalServerErrorException() if JWT_SECRET is missing', async () => {
			mockConfigService.get.mockImplementation((key: string) => {
				if (key === 'JWT_SECRET') return undefined;
				return 'val';
			});

			await expect(service.generateTokens(payload)).rejects.toThrow(
				InternalServerErrorException,
			);
		});

		it('should throw InternalServerErrorException() if JWT_REFRESH_SECRET is missing', async () => {
			mockConfigService.get = vi.fn().mockImplementation((key: string) => {
				if (key === 'JWT_REFRESH_SECRET') return undefined;
				return 'secret';
			});

			await expect(service.generateTokens(payload)).rejects.toThrow(
				InternalServerErrorException,
			);
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
		it('should call .removeRefreshToken() and return repository result', async () => {
			mockTokensRepository.deleteByUserId.mockResolvedValue(true);

			const result = await service.removeRefreshToken(MOCKED_USER_ID, MOCKED_TOKEN);

			expect(result).toBe(true);
			expect(mockTokensRepository.deleteByUserId).toHaveBeenCalledWith(
				MOCKED_USER_ID,
				MOCKED_TOKEN,
			);
		});
	});

	describe('validateRefreshToken', () => {
		it('should call .validateRefreshToken() and return repository result', async () => {
			mockTokensRepository.validate.mockResolvedValue(true);

			const result = await service.validateRefreshToken(MOCKED_USER_ID, MOCKED_TOKEN);

			expect(result).toBe(true);
			expect(mockTokensRepository.validate).toHaveBeenCalledWith(MOCKED_USER_ID, MOCKED_TOKEN);
		});
	});
});
