export function prepareAiResponse(raw: string): string {
	return raw
		.trim()
		.replace(/^```(?:json)?\s*/i, '')
		.replace(/\s*```$/i, '')
		.trim()
		.replace(/(?<=:\s*")([\s\S]*?)(?="(?:\s*[,}]))/g, (match) =>
			match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t'),
		);
}
