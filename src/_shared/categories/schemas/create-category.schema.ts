import { z } from 'zod';

import { err } from '../../common/utils/zod/err.util';

import { ERROR } from '../../common/constants/error';

/** Request schema without defaults for frontend */
export const CreateCategoryRequestSchema = z.object({
	name: z
		.string(err(ERROR.CATEGORY.NAME_IS_NOT_STRING))
		.trim()
		.min(1, ERROR.CATEGORY.NAME_IS_EMPTY),
	description: z
		.string(err(ERROR.CATEGORY.DESCRIPTION_IS_NOT_STRING))
		.trim()
		.min(1, ERROR.CATEGORY.DESCRIPTION_IS_EMPTY),
});

/** Validated schema with defaults for backend */
export const CreateCategorySchema = CreateCategoryRequestSchema;

/** Request type without defaults for frontend */
export type CreateCategoryRequest = z.input<typeof CreateCategoryRequestSchema>;

/** Validated type with defaults for backend */
export type CreateCategory = z.output<typeof CreateCategorySchema>;
