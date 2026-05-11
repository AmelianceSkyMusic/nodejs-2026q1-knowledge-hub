import { ThinkingLevel } from '@google/genai';

export const GEMINI_CONFIGS = {
	TECH: {
		thinkingConfig: { includeThoughts: false, thinkingLevel: ThinkingLevel.MINIMAL },
		temperature: 0,
	},
	CHAT: {
		thinkingConfig: { includeThoughts: false },
		temperature: 2,
	},
} as const;
