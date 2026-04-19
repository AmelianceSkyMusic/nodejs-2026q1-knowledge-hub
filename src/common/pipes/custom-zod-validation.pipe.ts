import { createZodValidationPipe, ZodValidationException } from 'nestjs-zod';

import type { ZodError } from 'zod';

export const CustomZodValidationPipe = createZodValidationPipe({
	strictSchemaDeclaration: process.env.NODE_ENV !== 'production',

	createValidationException: (error: ZodError) => {
		return new ZodValidationException(error);
	},
});
