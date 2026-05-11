import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ChatRagRequest, ChatRagSchema } from 'shared/ai/rag/schemas/chat-rag.schema';

import { RAG_SWAGGER } from './rag.swagger';

export class ChatRagDto extends createZodDto(ChatRagSchema) {
	@ApiProperty(RAG_SWAGGER.QUESTION)
	question: ChatRagRequest['question'];

	@ApiProperty(RAG_SWAGGER.CONVERSATION_ID)
	conversationId?: ChatRagRequest['conversationId'];
}
