import type { ORDER } from '../constants/order';

export type Order = (typeof ORDER)[keyof typeof ORDER];
