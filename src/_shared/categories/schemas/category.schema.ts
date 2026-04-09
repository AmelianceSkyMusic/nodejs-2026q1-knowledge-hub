import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

export const CategorySchema = z.object({
	id: zUuid(),
	name: z.string(),
	description: z.string(),
});

export type Category = z.output<typeof CategorySchema>;
