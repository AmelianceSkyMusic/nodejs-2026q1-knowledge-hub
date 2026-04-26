import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';

export function checkIsPublic(reflector: Reflector, context: ExecutionContext): boolean {
	return reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
		context.getHandler(),
		context.getClass(),
	]);
}

const PUBLIC_PATHS = ['/', '/doc'];

export function checkIsSystemPublicPath(url: string) {
	if (!url) return false;
	return PUBLIC_PATHS.some((path) => {
		if (path === '/') return url === '/';
		return url.startsWith(path);
	});
}
