import { eq } from 'drizzle-orm';

import * as schema from '../../src/drizzle/db/schema';
import { drizzle } from '../lib/drizzle';

type Role = 'viewer' | 'editor' | 'admin';

const promoteUserRole = async (userId: string, role: Role): Promise<void> => {
	await drizzle.update(schema.users).set({ role }).where(eq(schema.users.id, userId));
};

export default promoteUserRole;
