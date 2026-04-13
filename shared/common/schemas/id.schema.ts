import { zUuid } from '../utils/zod/z-uuid.util';

import type { z } from 'zod';

export const IdSchema = zUuid();

export type Id = z.infer<typeof IdSchema>;
