export type DeepValueOf<T> =
	T extends Record<string, unknown> ? { [K in keyof T]: DeepValueOf<T[K]> }[keyof T] : T;
