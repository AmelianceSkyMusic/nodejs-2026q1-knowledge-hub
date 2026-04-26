import { Test } from '@nestjs/testing';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { UnauthorizedError } from 'src/common/errors/unauthorized.error';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';

import { AuthService } from './auth.service';

import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

import type { TestingModule } from '@nestjs/testing';

import type { LoginDto } from './dto/login.dto';
import type { RefreshDto } from './dto/refresh.dto';
import type { SignupDto } from './dto/signup.dto';

const { compareMock } = vi.hoisted(() => ({
	compareMock: vi.fn().mockResolvedValue(true),
}));

vi.mock('bcrypt', () => ({
	compare: compareMock,
}));

import { MOCK } from 'src/common/constants/mock';

describe('AuthService', () => {
	let service: AuthService;

	const MOCKED_USER_ID = MOCK.COMMON.ID;
	const MOCKED_LOGIN = MOCK.USER.LOGIN;
	const MOCKED_PASSWORD = MOCK.AUTH.PASSWORD;
	const MOCKED_ROLE = USER_ROLES.VIEWER;
	const MOCKED_TOKEN = MOCK.AUTH.TOKEN;

	const user = {
		id: MOCKED_USER_ID,
		login: MOCKED_LOGIN,
		password: MOCK.AUTH.HASHED_PASSWORD,
		role: MOCKED_ROLE,
	};

	const tokens = {
		accessToken: MOCK.AUTH.ACCESS_TOKEN,
		refreshToken: MOCK.AUTH.REFRESH_TOKEN,
	};

	const signupDto: SignupDto = {
		login: MOCKED_LOGIN,
		password: MOCKED_PASSWORD,
	};

	const loginDto: LoginDto = {
		login: MOCKED_LOGIN,
		password: MOCKED_PASSWORD,
	};

	const refreshDto: RefreshDto = {
		refreshToken: MOCKED_TOKEN,
	};

	const mockUsersService = {
		createWithSignup: vi.fn(),
		findOneByLoginWithPassword: vi.fn(),
		findOne: vi.fn(),
	};

	const mockTokensService = {
		generateTokens: vi.fn(),
		verifyRefreshToken: vi.fn(),
		validateRefreshToken: vi.fn(),
		removeRefreshToken: vi.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: TokensService,
					useValue: mockTokensService,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		compareMock.mockResolvedValue(true);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('signup', () => {
		it('should call usersService.createWithSignup() and return result', async () => {
			mockUsersService.createWithSignup.mockResolvedValue(user);

			const result = await service.signup(signupDto);

			expect(result).toEqual(user);

			expect(mockUsersService.createWithSignup).toHaveBeenCalledWith({
				...signupDto,
				role: USER_ROLES.VIEWER,
			});
		});
	});

	describe('login', () => {
		it('should login and return tokens', async () => {
			mockUsersService.findOneByLoginWithPassword.mockResolvedValue(user);
			mockTokensService.generateTokens.mockResolvedValue(tokens);

			const result = await service.login(loginDto);

			expect(result).toEqual(tokens);
			expect(compareMock).toHaveBeenCalledWith(loginDto.password, user.password);
			expect(mockTokensService.generateTokens).toHaveBeenCalledWith({
				userId: user.id,
				login: user.login,
				role: user.role,
			});
		});

		it('should throw ForbiddenError() if user not found', async () => {
			mockUsersService.findOneByLoginWithPassword.mockResolvedValue(null);

			await expect(service.login(loginDto)).rejects.toThrow(ForbiddenError);
		});

		it('should throw ForbiddenError() if password mismatch', async () => {
			mockUsersService.findOneByLoginWithPassword.mockResolvedValue(user);
			compareMock.mockResolvedValue(false);

			await expect(service.login(loginDto)).rejects.toThrow(ForbiddenError);
		});
	});

	describe('refresh', () => {
		it('should refresh tokens and return new ones', async () => {
			const payload = { userId: user.id };
			mockTokensService.verifyRefreshToken.mockReturnValue(payload);
			mockTokensService.validateRefreshToken.mockResolvedValue(true);
			mockUsersService.findOne.mockResolvedValue(user);
			mockTokensService.generateTokens.mockResolvedValue(tokens);

			const result = await service.refresh(refreshDto);

			expect(result).toEqual(tokens);
			expect(mockTokensService.verifyRefreshToken).toHaveBeenCalledWith(refreshDto.refreshToken);
			expect(mockTokensService.validateRefreshToken).toHaveBeenCalledWith(
				user.id,
				refreshDto.refreshToken,
			);
			expect(mockUsersService.findOne).toHaveBeenCalledWith(user.id);
		});

		it('should throw UnauthorizedError() if refreshToken is empty', async () => {
			await expect(service.refresh({ refreshToken: '' })).rejects.toThrow(UnauthorizedError);
		});

		it('should throw ForbiddenError() if token verification fails', async () => {
			mockTokensService.verifyRefreshToken.mockReturnValue(null);

			await expect(service.refresh(refreshDto)).rejects.toThrow(ForbiddenError);
			await expect(service.refresh(refreshDto)).rejects.toThrow(ERROR.TOKEN.INVALID);
		});

		it('should throw ForbiddenError() if token is not valid in DB', async () => {
			mockTokensService.verifyRefreshToken.mockReturnValue({ userId: user.id });
			mockTokensService.validateRefreshToken.mockResolvedValue(false);

			await expect(service.refresh(refreshDto)).rejects.toThrow(ForbiddenError);
		});

		it('should throw ForbiddenError() if user not found', async () => {
			mockTokensService.verifyRefreshToken.mockReturnValue({ userId: user.id });
			mockTokensService.validateRefreshToken.mockResolvedValue(true);
			mockUsersService.findOne.mockResolvedValue(null);

			await expect(service.refresh(refreshDto)).rejects.toThrow(ForbiddenError);
		});
	});

	describe('logout', () => {
		it('should call removeRefreshToken()', async () => {
			mockTokensService.verifyRefreshToken.mockReturnValue({ userId: user.id });

			await service.logout(refreshDto);

			expect(mockTokensService.verifyRefreshToken).toHaveBeenCalledWith(refreshDto.refreshToken);
			expect(mockTokensService.removeRefreshToken).toHaveBeenCalledWith(
				user.id,
				refreshDto.refreshToken,
			);
		});

		it('should throw UnauthorizedError() if refreshToken is empty', async () => {
			await expect(service.logout({ refreshToken: '' })).rejects.toThrow(UnauthorizedError);
		});

		it('should throw ForbiddenError() if token verification fails', async () => {
			mockTokensService.verifyRefreshToken.mockReturnValue(null);

			await expect(service.logout(refreshDto)).rejects.toThrow(ForbiddenError);
		});
	});
});
