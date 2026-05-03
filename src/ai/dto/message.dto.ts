import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { MessageSchema } from 'shared/ai/schemas/message.schema';

import { AI_SWAGGER } from './ai.swagger';

import type { Message } from 'shared/ai/schemas/message.schema';

export class MessageDto extends createZodDto(MessageSchema) {
	@ApiProperty(AI_SWAGGER.MESSAGE_FROM_AI)
	message: Message['message'];
}
