import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import {
	RagChat,
	RagChatSchema,
	RagChatSources,
	RagChatSourcesSchema,
} from 'shared/ai/rag/schemas/rag-chat.schema';

import { RAG_SWAGGER } from './rag.swagger';

export class RagChatSourcesDto extends createZodDto(RagChatSourcesSchema) {
	@ApiProperty(RAG_SWAGGER.ARTICLE_ID)
	articleId: RagChatSources['articleId'];

	@ApiProperty(RAG_SWAGGER.ARTICLE_TITLE)
	articleTitle: RagChatSources['articleTitle'];

	@ApiProperty(RAG_SWAGGER.RELEVANT_CHUNK)
	relevantChunk: RagChatSources['relevantChunk'];
}

export class RagChatDto extends createZodDto(RagChatSchema) {
	@ApiProperty(RAG_SWAGGER.ANSWER)
	answer: RagChat['answer'];

	@ApiProperty({ ...RAG_SWAGGER.SOURCES, type: [RagChatSourcesDto] })
	sources: RagChatSourcesDto[];

	@ApiProperty(RAG_SWAGGER.CONVERSATION_ID)
	conversationId: RagChat['conversationId'];
}
