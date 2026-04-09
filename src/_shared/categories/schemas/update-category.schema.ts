import { CreateCategoryRequestSchema } from './create-category.schema';

import type { z } from 'zod';

/** Request schema without defaults for frontend */
export const UpdateCategoryRequestSchema = CreateCategoryRequestSchema.partial();

/** Validated schema with defaults for backend */
export const UpdateCategorySchema = UpdateCategoryRequestSchema;

/** Request type without defaults for frontend */
export type UpdateCategoryRequest = z.output<typeof UpdateCategoryRequestSchema>;

/** Validated type with defaults for backend */
export type UpdateCategory = z.output<typeof UpdateCategorySchema>;
