import { CategorySchema } from '../../categories/schemas/category.schema';
import { UserSchema } from '../../users/schemas/user.schema';
import { ArticleSchema } from './article.schema';

import type { z } from 'zod';

export const ArticleWithRelationsSchema = ArticleSchema.extend({
	author: UserSchema.nullable(),
	category: CategorySchema.nullable(),
});

export type ArticleWithRelations = z.infer<typeof ArticleWithRelationsSchema>;
