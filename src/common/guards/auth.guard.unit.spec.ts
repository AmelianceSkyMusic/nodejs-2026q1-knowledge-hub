import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { TokensService } from 'src/tokens/tokens.service';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { AuthGuard } from './auth.guard';

import { USER_ROLES } from 'shared/users/constants/user-role';

import type { ExecutionContext } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

describe('AuthGuard', () => {
	let guard: AuthGuard;

	const mockTokensService = {
		verifyAccessToken: vi.fn(),
	};

	const mockReflector = {
		getAllAndOverride: vi.fn(),
	};

	const mockContext = {
		switchToHttp: () => ({
			getRequest: () => ({
				url: '/api/protected',
				headers: {
					authorization: 'Bearer valid-token',
				},
				user: { role: USER_ROLES.ADMIN },
			}),
		}),
		getHandler: vi.fn(),
		getClass: vi.fn(),
	} as unknown as ExecutionContext;

	const mockApiPathContext = {
		switchToHttp: () => ({
			getRequest: () => ({
				url: '/',
			}),
		}),
		getHandler: vi.fn(),
		getClass: vi.fn(),
	} as unknown as ExecutionContext;

	const mockDocPathContext = {
		switchToHttp: () => ({
			getRequest: () => ({
				url: '/doc',
			}),
		}),
		getHandler: vi.fn(),
		getClass: vi.fn(),
	} as unknown as ExecutionContext;

	const mockUnauthenticatedContext = {
		switchToHttp: () => ({
			getRequest: () => ({
				url: '/protected',
				headers: {},
			}),
		}),
		getHandler: vi.fn(),
		getClass: vi.fn(),
	} as unknown as ExecutionContext;

	const mackInvalidTokenContext = {
		switchToHttp: () => ({
			getRequest: () => ({
				url: '/user',
				headers: {
					authorization: 'invalid-token',
				},
			}),
		}),
		getHandler: vi.fn(),
		getClass: vi.fn(),
	} as unknown as ExecutionContext;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthGuard,
				{ provide: TokensService, useValue: mockTokensService },
				{ provide: Reflector, useValue: mockReflector },
			],
		}).compile();

		guard = module.get<AuthGuard>(AuthGuard);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	it('should allow access to public route', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return true;
			return null;
		});

		expect(guard.canActivate(mockContext)).toBe(true);
	});

	it('should allow access to api path', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			return null;
		});

		expect(guard.canActivate(mockApiPathContext)).toBe(true);
	});

	it('should allow access to doc path', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			return null;
		});

		expect(guard.canActivate(mockDocPathContext)).toBe(true);
	});

	it('should not allow unauthenticated user to access and throw UnauthorizedError()', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			return null;
		});
		expect(() => guard.canActivate(mockUnauthenticatedContext)).toThrow(UnauthorizedError);
	});

	it('should not allow invalid token type string to access and throw UnauthorizedError()', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			return null;
		});
		expect(() => guard.canActivate(mackInvalidTokenContext)).toThrow(UnauthorizedError);
	});

	it('should not allow non verify token and throw UnauthorizedError()', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			return null;
		});
		mockTokensService.verifyAccessToken.mockReturnValue(null);
		expect(() => guard.canActivate(mackInvalidTokenContext)).toThrow(UnauthorizedError);
	});

	it('should allow access to authorized user', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			return null;
		});
		mockTokensService.verifyAccessToken.mockReturnValue({});

		expect(guard.canActivate(mockContext)).toBe(true);
	});
});
