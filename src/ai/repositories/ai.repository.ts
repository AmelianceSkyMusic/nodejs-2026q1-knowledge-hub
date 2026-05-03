import type { Id } from 'shared/common/schemas/id.schema';

export type MessageRole = 'user' | 'model';

export type ChatMessage = {
	role: MessageRole;
	parts: [{ text: string }];
};

export type ChatSession = {
	id: string;
	messages: ChatMessage[];
	createdAt: Date;
};

export class AiRepository {
	protected chatSessions = new Map<string, ChatSession>();
	protected statsByEndpoint = new Map<string, { requests: number; tokens: number }>();
	protected totalRequests = 0;
	protected totalTokens = 0;

	createByUser(userId: Id) {
		const chatSession: ChatSession = {
			id: userId,
			messages: [],
			createdAt: new Date(),
		};
		this.chatSessions.set(userId, chatSession);
		return chatSession;
	}

	addMessageByUserId(userId: Id, chatMessage: ChatMessage) {
		const userChatSession = this.chatSessions.get(userId);
		const updatedChatSession = {
			...userChatSession,
			messages: [...userChatSession.messages, chatMessage],
		};
		this.chatSessions.set(userId, updatedChatSession);
		return updatedChatSession;
	}

	getByUserId(userId: Id) {
		return this.chatSessions.get(userId);
	}

	updateStats(endpoint: string, tokens: number = 0) {
		const current = this.statsByEndpoint.get(endpoint) || { requests: 0, tokens: 0 };
		this.statsByEndpoint.set(endpoint, {
			requests: current.requests + 1,
			tokens: current.tokens + tokens,
		});
		this.totalRequests = this.totalRequests + 1;
		this.totalTokens = this.totalTokens + tokens;
	}

	getStatistics() {
		return {
			totalRequests: this.totalRequests,
			totalTokens: this.totalTokens,
			endpoints: Object.fromEntries(this.statsByEndpoint),
		};
	}
}
