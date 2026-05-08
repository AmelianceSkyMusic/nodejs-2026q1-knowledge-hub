import { InternalServerError } from 'src/common/errors/internal-server.error';

import type { Content } from '@google/genai';
import type { Id } from 'shared/common/schemas/id.schema';

export type ChatSession = {
	id: string;
	messages: Content[];
	createdAt: Date;
};

export class AiRepository {
	protected chatSessions = new Map<string, ChatSession>();
	protected statsByEndpoint = new Map<string, { requests: number; tokens: number }>();
	protected totalRequests = 0;
	protected totalTokens = 0;
	protected totalLatency = 0;
	protected cacheHits = 0;
	protected cacheMisses = 0;

	createByUser(userId: Id) {
		const chatSession: ChatSession = {
			id: userId,
			messages: [],
			createdAt: new Date(),
		};
		this.chatSessions.set(userId, chatSession);
		return chatSession;
	}

	addMessageByUserId(userId: Id, chatMessage: Content) {
		const userChatSession = this.chatSessions.get(userId);
		if (!userChatSession) throw new InternalServerError('Chat session not found');

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

	updateStats(endpoint: string, tokens: number = 0, latency: number = 0) {
		const current = this.statsByEndpoint.get(endpoint) || { requests: 0, tokens: 0 };
		this.statsByEndpoint.set(endpoint, {
			requests: current.requests + 1,
			tokens: current.tokens + tokens,
		});
		this.totalRequests = this.totalRequests + 1;
		this.totalTokens = this.totalTokens + tokens;
		this.totalLatency = this.totalLatency + latency;
	}

	recordCacheHit() {
		this.cacheHits++;
	}

	recordCacheMiss() {
		this.cacheMisses++;
	}

	getStatistics() {
		const cacheHitRatio =
			this.cacheHits + this.cacheMisses > 0
				? (this.cacheHits / (this.cacheHits + this.cacheMisses)).toFixed(2)
				: '0.00';

		const avgLatency =
			this.totalRequests > 0 ? (this.totalLatency / this.totalRequests).toFixed(2) : '0';

		return {
			totalRequests: this.totalRequests,
			totalTokens: this.totalTokens,
			avgLatencyMs: avgLatency,
			cacheHits: this.cacheHits,
			cacheMisses: this.cacheMisses,
			cacheHitRatio,
			endpoints: Object.fromEntries(this.statsByEndpoint),
		};
	}
}
