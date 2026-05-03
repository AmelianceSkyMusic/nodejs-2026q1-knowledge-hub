import type { GeminiRequest } from 'src/ai/types/gemini/request.types';

export function generateGeminiContent(prompt: string, systemPrompt: string): GeminiRequest {
	return {
		contents: [
			{
				parts: [{ text: prompt }],
			},
		],
		systemInstruction: {
			parts: [{ text: systemPrompt }],
		},
	};
}
