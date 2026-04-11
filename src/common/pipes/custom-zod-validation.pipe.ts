// import { BadRequestException, Logger } from '@nestjs/common';
// import { createZodValidationPipe } from 'nestjs-zod';

// import type { ZodError } from 'zod';

// const logger = new Logger('ZodValidationPipe');

// export const ZodValidationPipe = createZodValidationPipe({
// 	createValidationException: (error: ZodError) => {
// 		const messages = error.issues.map((issue) => issue.message);
// 		logger.warn('Zod Validation Issues:', JSON.stringify(error.issues, null, 2));
// 		return new BadRequestException(messages);
// 	},
// });

import { createZodValidationPipe, ZodValidationException } from 'nestjs-zod';

import type { ZodError } from 'zod';

export const CustomZodValidationPipe = createZodValidationPipe({
	strictSchemaDeclaration: process.env.NODE_ENV !== 'production',

	createValidationException: (error: ZodError) => {
		return new ZodValidationException(error);
	},
});
