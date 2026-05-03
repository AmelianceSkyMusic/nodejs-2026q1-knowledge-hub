import type { Content } from './content.types';
import type { SafetyRating } from './safety.types';
import type { BlockReason, FinishReason, Modality, ModelStage } from './shared.types';

export type ModalityTokenCount = {
	modality: Modality;
	tokenCount: number;
};

export type UsageMetadata = {
	promptTokenCount: number;
	cachedContentTokenCount?: number;
	candidatesTokenCount?: number;
	toolUsePromptTokenCount?: number;
	thoughtsTokenCount?: number;
	totalTokenCount: number;
	promptTokensDetails?: ModalityTokenCount[];
	cacheTokensDetails?: ModalityTokenCount[];
	candidatesTokensDetails?: ModalityTokenCount[];
	toolUsePromptTokensDetails?: ModalityTokenCount[];
};

export type PromptFeedback = {
	blockReason?: BlockReason;
	safetyRatings?: SafetyRating[];
};

export type CitationSource = {
	startIndex?: number;
	endIndex?: number;
	uri?: string;
	license?: string;
};

export type CitationMetadata = {
	citationSources: CitationSource[];
};

export type Segment = {
	partIndex: number;
	startIndex: number;
	endIndex: number;
	text: string;
};

export type GroundingChunkWeb = {
	uri: string;
	title: string;
};

export type GroundingChunkImage = {
	sourceUri: string;
	imageUri: string;
	title: string;
	domain: string;
};

export type GroundingChunkRetrievedContext = {
	uri?: string;
	title?: string;
	text?: string;
	fileSearchStore?: string;
};

export type GroundingChunk = {
	web?: GroundingChunkWeb;
	image?: GroundingChunkImage;
	retrievedContext?: GroundingChunkRetrievedContext;
};

export type GroundingSupport = {
	groundingChunkIndices?: number[];
	confidenceScores?: number[];
	renderedParts?: number[];
	segment?: Segment;
};

export type SearchEntryPoint = {
	renderedContent?: string;
	sdkBlob?: string;
};

export type RetrievalMetadata = {
	googleSearchDynamicRetrievalScore?: number;
};

export type GroundingMetadata = {
	groundingChunks?: GroundingChunk[];
	groundingSupports?: GroundingSupport[];
	webSearchQueries?: string[];
	imageSearchQueries?: string[];
	searchEntryPoint?: SearchEntryPoint;
	retrievalMetadata?: RetrievalMetadata;
	googleMapsWidgetContextToken?: string;
};

export type LogprobsCandidate = {
	token: string;
	tokenId: number;
	logProbability: number;
};

export type TopCandidates = {
	candidates: LogprobsCandidate[];
};

export type LogprobsResult = {
	topCandidates: TopCandidates[];
	chosenCandidates: LogprobsCandidate[];
	logProbabilitySum: number;
};

export type UrlMetadata = {
	retrievedUrl: string;
	urlRetrievalStatus:
		| 'URL_RETRIEVAL_STATUS_UNSPECIFIED'
		| 'URL_RETRIEVAL_STATUS_SUCCESS'
		| 'URL_RETRIEVAL_STATUS_ERROR'
		| 'URL_RETRIEVAL_STATUS_PAYWALL'
		| 'URL_RETRIEVAL_STATUS_UNSAFE';
};

export type UrlContextMetadata = {
	urlMetadata: UrlMetadata[];
};

export type Candidate = {
	content?: Content;
	finishReason?: FinishReason;
	finishMessage?: string;
	safetyRatings?: SafetyRating[];
	citationMetadata?: CitationMetadata;
	tokenCount?: number;
	groundingMetadata?: GroundingMetadata;
	avgLogprobs?: number;
	logprobsResult?: LogprobsResult;
	urlContextMetadata?: UrlContextMetadata;
	index?: number;
};

export type ModelStatus = {
	modelStage?: ModelStage;
	retirementTime?: string;
	message?: string;
};
