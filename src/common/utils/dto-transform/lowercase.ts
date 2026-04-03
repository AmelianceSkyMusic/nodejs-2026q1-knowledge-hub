import type { TransformFnParams } from 'class-transformer';

export function lowercase({ value }: TransformFnParams): unknown {
	if (typeof value !== 'string') return value;
	return value.toLowerCase();
}
