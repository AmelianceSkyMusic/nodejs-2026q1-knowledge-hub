import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';

export const checkIsPublic = (reflector: Reflector, context: ExecutionContext): boolean => {
	return reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
		context.getHandler(),
		context.getClass(),
	]);
};
