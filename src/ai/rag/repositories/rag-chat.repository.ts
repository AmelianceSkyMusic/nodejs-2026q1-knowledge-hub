import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Content } from '@google/genai';
import type { Id } from 'shared/common/schemas/id.schema';

export type ChatSession = {
	id: string;
	messages: Content[];
};

@Injectable()
export class RagChatRepository {
	private readonly maxHistoryDepth: number;
	private readonly chatSessions = new Map<string, ChatSession>();

	constructor(private readonly configService: ConfigService) {
		this.maxHistoryDepth = this.configService.get<number>('rag.maxMessages');
	}

	addMessageByConversationId(id: Id, chatMessage: Content) {
		let chatSession = this.chatSessions.get(id);
		if (!chatSession) {
			chatSession = {
				id,
				messages: [],
			};
			this.chatSessions.set(id, chatSession);
		}

		const newMessages = [...chatSession.messages, chatMessage];
		const messages =
			newMessages.length > this.maxHistoryDepth
				? newMessages.slice(-this.maxHistoryDepth)
				: newMessages;

		const updatedChatSession = { ...chatSession, messages };

		this.chatSessions.set(id, updatedChatSession);
		return updatedChatSession;
	}

	getByConversationId(conversationId: Id) {
		return this.chatSessions.get(conversationId);
	}
}
