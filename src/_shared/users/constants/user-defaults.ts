import { USER_ROLES } from './user-role';
import { USER_SORT_BY } from './user-sort-by';

import { ORDER } from '../../common/constants/order';

export const USER_DEFAULTS = {
	ROLE: USER_ROLES.VIEWER,
	LIMIT: 10,
	SORT_BY: USER_SORT_BY.LOGIN,
	ORDER: ORDER.ASC,
};
