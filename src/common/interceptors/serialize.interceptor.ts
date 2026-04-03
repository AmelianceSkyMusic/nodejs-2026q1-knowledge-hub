import { UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';

import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';

interface ClassConstructor {
	new (...args: unknown[]): object;
}

export function Serialize(dto: ClassConstructor) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: ClassConstructor) {}

	intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			map((data: unknown) => {
				return plainToInstance(this.dto, data, {
					excludeExtraneousValues: true,
				});
			}),
		);
	}
}
