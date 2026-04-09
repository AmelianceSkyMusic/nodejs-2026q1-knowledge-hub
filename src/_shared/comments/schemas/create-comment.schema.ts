import { z } from 'zod';

import { err } from '../../common/utils/zod/err.util';
import { zUuid } from '../../common/utils/zod/z-uuid.util';

import { ERROR } from '../../common/constants/error';
import { COMMENT_DEFAULTS } from '../constants/comment-defaults';

/** Request schema without defaults for frontend */
export const CreateCommentRequestSchema = z.object({
	content: z
		.string(err(ERROR.COMMENT.CONTENT_IS_NOT_STRING))
		.trim()
		.min(1, ERROR.COMMENT.CONTENT_IS_EMPTY),
	articleId: zUuid(err(ERROR.VALIDATION.INVALID_UUID)),
	authorId: zUuid(err(ERROR.VALIDATION.INVALID_UUID)).nullable().optional(),
});

/** Validated schema with defaults for backend */
export const CreateCommentSchema = CreateCommentRequestSchema.extend({
	authorId: CreateCommentRequestSchema.shape.authorId.default(COMMENT_DEFAULTS.authorId),
});

/** Request type without defaults for frontend */
export type CreateCommentRequest = z.input<typeof CreateCommentRequestSchema>;

/** Validated type with defaults for backend */
export type CreateComment = z.output<typeof CreateCommentSchema>;
