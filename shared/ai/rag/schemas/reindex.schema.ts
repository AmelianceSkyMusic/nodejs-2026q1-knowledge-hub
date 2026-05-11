import { z } from 'zod';

import { zUuid } from '../../../common/utils/zod/z-uuid.util';

import { RAG_DEFAULTS } from '../constants/rag-defaults';

/** Request schema without defaults for frontend */
export const ReindexRequestSchema = z.object({
	onlyPublished: z.boolean().optional(),
	articleIds: z.array(zUuid()).optional(),
});

/** Validated schema with defaults for backend */
export const ReindexSchema = ReindexRequestSchema.extend({
	onlyPublished: ReindexRequestSchema.shape.onlyPublished.default(RAG_DEFAULTS.ONLY_PUBLISHED),
});

/** Request type without defaults for frontend */
export type ReindexRequest = z.input<typeof ReindexRequestSchema>;

/** Validated type with defaults for backend */
export type Reindex = z.output<typeof ReindexSchema>;
