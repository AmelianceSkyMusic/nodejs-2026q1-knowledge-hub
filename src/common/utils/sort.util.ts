import { ORDER } from 'src/_shared/common/constants/order';

import type { Order } from 'src/_shared/common/types/order';

export function sort<T>(data: T[], sortBy: keyof T, order: Order): T[] {
	return [...data].sort((a, b) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];

		if (aValue < bValue) return order === ORDER.ASC ? -1 : 1;
		if (aValue > bValue) return order === ORDER.ASC ? 1 : -1;

		return 0;
	});
}
