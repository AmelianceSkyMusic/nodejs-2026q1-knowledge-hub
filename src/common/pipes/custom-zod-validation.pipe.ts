import { ArgumentMetadata, Injectable, Logger } from '@nestjs/common';
import {
	createZodValidationPipe,
	ZodSchemaDeclarationException,
	ZodValidationException,
} from 'nestjs-zod';

import type { ZodError } from 'zod';

const BaseCustomZodValidationPipe = createZodValidationPipe({
	strictSchemaDeclaration: process.env.NODE_ENV !== 'production',

	createValidationException: (error: ZodError) => {
		return new ZodValidationException(error);
	},
});

@Injectable()
export class CustomZodValidationPipe extends BaseCustomZodValidationPipe {
	private readonly logger = new Logger(CustomZodValidationPipe.name);

	override transform(value: unknown, metadata: ArgumentMetadata) {
		try {
			return super.transform(value, metadata);
		} catch (error) {
			if (error instanceof ZodSchemaDeclarationException) {
				this.logger.error(
					`Zod Schema Declaration Error: ${error.message}. This is likely due to missing @ZodDto() in your controller route`,
				);
			}
			throw error;
		}
	}
}
