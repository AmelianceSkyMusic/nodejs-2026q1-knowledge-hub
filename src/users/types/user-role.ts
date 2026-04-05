import type { USER_ROLES } from '../constants/user-role';

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
