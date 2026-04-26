import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';

import { USER_ROLES } from 'shared/users/constants/user-role';

import type { ExecutionContext } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

describe('RolesGuard', () => {
	let guard: RolesGuard;

	const mockReflector = {
		getAllAndOverride: vi.fn(),
	};

	const mockAdminContext = {
		switchToHttp: () => ({
			getRequest: () => ({
				user: { role: USER_ROLES.ADMIN },
			}),
		}),
		getHandler: vi.fn(),
		getClass: vi.fn(),
	} as unknown as ExecutionContext;

	const mockEditorContext = {
		switchToHttp: () => ({
			getRequest: () => ({
				user: { role: USER_ROLES.EDITOR },
			}),
		}),
		getHandler: vi.fn(),
		getClass: vi.fn(),
	} as unknown as ExecutionContext;

	const mockViewerContext = {
		switchToHttp: () => ({
			getRequest: () => ({
				user: { role: USER_ROLES.VIEWER },
			}),
		}),
		getHandler: vi.fn(),
		getClass: vi.fn(),
	} as unknown as ExecutionContext;

	const mockUnauthenticatedContext = {
		switchToHttp: () => ({
			getRequest: () => ({
				user: undefined,
			}),
		}),
		getHandler: vi.fn(),
		getClass: vi.fn(),
	} as unknown as ExecutionContext;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RolesGuard, { provide: Reflector, useValue: mockReflector }],
		}).compile();
		guard = module.get<RolesGuard>(RolesGuard);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	it('should allow access to public route', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return true;
			return null;
		});

		expect(guard.canActivate(mockViewerContext)).toBe(true);
	});

	it('should not allow unauthenticated user to access and throw ForbiddenException()', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			return null;
		});

		expect(() => guard.canActivate(mockUnauthenticatedContext)).toThrow(ForbiddenException);
	});

	it('should allow admin to access', () => {
		expect(guard.canActivate(mockAdminContext)).toBe(true);
	});

	it('should allow with user roles editor to access', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			if (key === ROLES_KEY) return [USER_ROLES.EDITOR];
			return null;
		});
		expect(guard.canActivate(mockEditorContext)).toBe(true);
	});

	it('should allow with user role viewer to access', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			if (key === ROLES_KEY) return [USER_ROLES.VIEWER];
			return null;
		});
		expect(guard.canActivate(mockViewerContext)).toBe(true);
	});

	it('should not allow viewer to access as admin is required', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			if (key === ROLES_KEY) return [USER_ROLES.ADMIN];
			return null;
		});
		expect(() => guard.canActivate(mockViewerContext)).toThrow(ForbiddenException);
	});

	it('should return false if no roles are required', () => {
		mockReflector.getAllAndOverride.mockImplementation((key) => {
			if (key === IS_PUBLIC_KEY) return false;
			if (key === ROLES_KEY) return null;
			return null;
		});
		expect(guard.canActivate(mockViewerContext)).toBe(false);
	});
});
