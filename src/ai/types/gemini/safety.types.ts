import type { HarmBlockThreshold, HarmCategory, HarmProbability } from './shared.types';

export type SafetySetting = {
	category: HarmCategory;
	threshold: HarmBlockThreshold;
};

export type SafetyRating = {
	category: HarmCategory;
	probability: HarmProbability;
	blocked?: boolean;
};
