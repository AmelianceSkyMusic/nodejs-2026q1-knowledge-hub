import type { MediaResolution, ResponseModality, ThinkingLevel } from './shared.types';

export type PrebuiltVoiceConfig = {
	voiceName: string;
};

export type VoiceConfig = {
	prebuiltVoiceConfig?: PrebuiltVoiceConfig;
};

export type SpeakerVoiceConfig = {
	speaker: string;
	voiceConfig: VoiceConfig;
};

export type MultiSpeakerVoiceConfig = {
	speakerVoiceConfigs: SpeakerVoiceConfig[];
};

export type SpeechConfig = {
	voiceConfig?: VoiceConfig;
	multiSpeakerVoiceConfig?: MultiSpeakerVoiceConfig;
	languageCode?: string;
};

export type ThinkingConfig = {
	includeThoughts?: boolean;
	thinkingBudget?: number;
	thinkingLevel?: ThinkingLevel;
};

export type ImageConfig = {
	aspectRatio?: string;
	imageSize?: '512' | '1K' | '2K' | '4K';
};

export type GenerationConfig = {
	stopSequences?: string[];
	responseMimeType?: string;
	responseSchema?: Record<string, unknown>;
	responseJsonSchema?: unknown;
	responseModalities?: ResponseModality[];
	candidateCount?: number;
	maxOutputTokens?: number;
	temperature?: number;
	topP?: number;
	topK?: number;
	seed?: number;
	presencePenalty?: number;
	frequencyPenalty?: number;
	responseLogprobs?: boolean;
	logprobs?: number;
	enableEnhancedCivicAnswers?: boolean;
	speechConfig?: SpeechConfig;
	thinkingConfig?: ThinkingConfig;
	imageConfig?: ImageConfig;
	mediaResolution?: MediaResolution;
};
