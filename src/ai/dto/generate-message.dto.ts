import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { GenerateMessageSchema } from 'shared/ai/schemas/generate-message.schema';

import { AI_SWAGGER } from './ai.swagger';

import type { GenerateMessage } from 'shared/ai/schemas/generate-message.schema';

export class GenerateMessageDto extends createZodDto(GenerateMessageSchema) {
	@ApiProperty(AI_SWAGGER.MESSAGE_TO_AI)
	message: GenerateMessage['message'];
}
