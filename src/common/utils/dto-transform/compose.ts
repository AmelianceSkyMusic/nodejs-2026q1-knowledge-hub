import type { TransformFnParams } from 'class-transformer';

export type TransformFunc = (params: TransformFnParams) => unknown;

export function compose(...funcs: TransformFunc[]): TransformFunc {
	return (params: TransformFnParams): unknown => {
		return funcs.reduce<unknown>((accValue, func) => {
			return func({ ...params, value: accValue });
		}, params.value);
	};
}
