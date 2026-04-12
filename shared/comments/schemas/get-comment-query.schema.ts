import { z } from 'zod';

import { zUuid } from '../../common/utils/zod/z-uuid.util';

/** Request schema without defaults for frontend */
export const GetCommentsQuerySchemaRequest = z.object({
	articleId: zUuid(),
});

/** Validated schema with defaults for backend */
export const GetCommentsQuerySchema = GetCommentsQuerySchemaRequest;

/** Request type without defaults for frontend */
export type GetCommentsQueryRequest = z.input<typeof GetCommentsQuerySchemaRequest>;

/** Validated type with defaults for backend */
export type GetCommentsQuery = z.output<typeof GetCommentsQuerySchema>;
