import { Injectable } from '@nestjs/common';
import { createZodValidationPipe, ZodValidationException } from 'nestjs-zod';

import type { ZodError } from 'zod';

@Injectable()
export class CustomZodValidationPipe extends createZodValidationPipe({
	createValidationException: (error: ZodError) => new ZodValidationException(error),
	strictSchemaDeclaration: process.env.NODE_ENV !== 'production',
}) {}
