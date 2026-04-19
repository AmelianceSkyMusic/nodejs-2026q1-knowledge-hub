import { SetMetadata } from '@nestjs/common';

import type { UserRole } from 'shared/users/types/user-role';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Exclude<UserRole, 'admin'>[]) => SetMetadata(ROLES_KEY, roles);
