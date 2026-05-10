import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	RagChatHistorySchema,
	RagChatMessageSchema,
} from 'shared/ai/rag/schemas/rag-chat-history.schema';

import { RAG_SWAGGER } from './rag.swagger';

export class RagChatMessageDto extends createZodDto(RagChatMessageSchema) {
	@ApiProperty(RAG_SWAGGER.MESSAGE_ROLE)
	role?: string;

	@ApiProperty(RAG_SWAGGER.MESSAGE_PARTS)
	parts?: { text?: string }[];
}

export class RagChatHistoryDto extends createZodDto(RagChatHistorySchema) {
	@ApiProperty(RAG_SWAGGER.CONVERSATION_ID)
	id: string;

	@ApiProperty({ ...RAG_SWAGGER.MESSAGES, type: [RagChatMessageDto] })
	messages: RagChatMessageDto[];
}
