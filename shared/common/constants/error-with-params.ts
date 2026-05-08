export const ERROR_WITH_PARAMS = {
	RAG: {
		MAX_SEARCH_LIMIT: (maxLimit: number) => `Max search limit is ${maxLimit}`,
	},
} as const;
