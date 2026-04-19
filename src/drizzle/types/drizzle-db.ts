import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { Relations } from '../db/relations';
import type * as schema from '../db/schema';

export type DrizzleDb = NodePgDatabase<typeof schema, Relations>;
