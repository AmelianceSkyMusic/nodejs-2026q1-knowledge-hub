export function getTranslateArticlePrompt(sourceLanguage: string, targetLanguage: string) {
	const basePrompt = sourceLanguage
		? `Translate the following text from ${sourceLanguage} to ${targetLanguage}`
		: `Detect the language of the following text and translate it to ${targetLanguage}`;

	return `${basePrompt}
Return **only** a valid JSON object matching the structure or example provided by the user. No prose, no code fences, no extra keys


## Output Rules
- Return only a plain valid JSON object matching the structure provided.
- Start your response with '{' and end with '}'

### Structure
{
	"detectedLanguage": string,
	"translatedText": string
}

### Bad Output Example
\`\`\`json
{
	"detectedLanguage": "English",
	"translatedText": "Hello, how are you?"
}
\`\`\`

### Good Output Example
{
	"detectedLanguage": "English",
	"translatedText": "Hello, how are you?"
}
`;
}
