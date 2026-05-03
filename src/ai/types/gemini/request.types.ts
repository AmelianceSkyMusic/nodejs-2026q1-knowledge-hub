import type { Content } from './content.types';
import type { GenerationConfig } from './generation.types';
import type { SafetySetting } from './safety.types';
import type { ServiceTier } from './shared.types';
import type { Tool, ToolConfig } from './tools.types';

export type GeminiRequest = {
	contents: Content[];
	tools?: Tool[];
	toolConfig?: ToolConfig;
	safetySettings?: SafetySetting[];
	systemInstruction?: Content;
	generationConfig?: GenerationConfig;
	cachedContent?: string;
	serviceTier?: ServiceTier;
	store?: boolean;
};
