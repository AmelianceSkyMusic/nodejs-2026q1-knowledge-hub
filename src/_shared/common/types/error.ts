import type { ERROR } from '../constants/error';
import type { DeepValueOf } from './helpers/deep-value-of';

export type Error = DeepValueOf<typeof ERROR>;
