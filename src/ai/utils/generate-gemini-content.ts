import type { GenerateContentConfig } from '@google/genai';
import type { GeminiRequest } from 'src/ai/gemini.service';

export function generateGeminiContent(
	prompt: string,
	systemPrompt: string,
	config?: GenerateContentConfig,
): GeminiRequest {
	const { systemInstruction, ...restConfig } = config;

	const baseInstruction =
		typeof systemInstruction === 'object' && !Array.isArray(systemInstruction)
			? systemInstruction
			: {};

	const existingParts = 'parts' in baseInstruction ? baseInstruction.parts : [];

	return {
		contents: [
			{
				parts: [{ text: prompt }],
			},
		],
		config: {
			...restConfig,
			systemInstruction: {
				...baseInstruction,
				parts: [{ text: systemPrompt }, ...existingParts],
			},
		},
	};
}
