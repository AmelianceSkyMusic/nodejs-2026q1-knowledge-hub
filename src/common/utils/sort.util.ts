import { ORDER } from '../constants/order';

import type { Order } from '../types/order';

export function sort<T>(data: T[], sortBy: keyof T, order: Order): T[] {
	return [...data].sort((a, b) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];

		if (aValue < bValue) return order === ORDER.ASC ? -1 : 1;
		if (aValue > bValue) return order === ORDER.ASC ? 1 : -1;

		return 0;
	});
}
