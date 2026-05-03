import type { Candidate, ModelStatus, PromptFeedback, UsageMetadata } from './metadata.types';

export type GeminiResponse = {
	candidates?: Candidate[];
	promptFeedback?: PromptFeedback;
	usageMetadata?: UsageMetadata;
	modelVersion?: string;
	responseId?: string;
	modelStatus?: ModelStatus;
};
