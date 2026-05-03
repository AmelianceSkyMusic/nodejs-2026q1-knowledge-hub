import { ANALYZE_ARTICLE_TASK } from 'shared/ai/constants/analyze-article-task';

import type { AnalyzeArticleTask } from 'shared/ai/types/analyze-article-task';

export function getAnalyzeArticlePrompt(task: AnalyzeArticleTask) {
	const basePrompt = `You are an expert article analyst. Analyze the article provided and return your findings as a plain JSON object.

## Output Rules
- Start your response with '{' and end with '}'
- Do NOT wrap output in backticks, code fences, or markdown of any kind
- Return exactly 3 to 5 suggestions — no more, no less
- Each suggestion must be specific and actionable, not generic

## Severity Guide
- "info"    → article is healthy, no significant issues found
- "warning" → minor issues or improvement opportunities exist
- "error"   → critical problems: missing core content, factual errors, or broken structure

## Output Structure
{
  "analysis": string,        // 2–4 sentences describing the main finding
  "suggestions": string[],   // exactly 3–5 specific, actionable items
  "severity": "info" | "warning" | "error"
}

## Bad Output Example
\`\`\`json
{
  "analysis": "The article has some issues.",
  "suggestions": ["Improve it", "Fix things"],
  "severity": "warning"
}
\`\`\`

## Good Output Example

### For severity "info":
{
  "analysis": "The article is well-structured, accurate, and easy to follow. All claims are supported and the conclusion is strong.",
  "suggestions": [
    "Add a short TL;DR at the top for readers who want a quick overview.",
    "Include one or two real-world examples to make abstract concepts more tangible.",
    "Consider adding a 'Further Reading' section at the end."
  ],
  "severity": "info"
}

### For severity "warning":
{
  "analysis": "The article presents its topic clearly but lacks a structured conclusion. Key claims in the third section are unsupported by sources.",
  "suggestions": [
    "Add a concluding paragraph that summarizes the main takeaways.",
    "Include citations for the statistics mentioned in paragraphs 3 and 5.",
    "Break the second section into two shorter sections to improve readability.",
    "Use subheadings to help readers navigate the longer middle portions.",
    "Trim the fourth paragraph — it repeats points already made in the introduction."
  ],
  "severity": "warning"
}

### For severity "error":
{
  "analysis": "The article contains critical factual errors and is missing its core content. The structure is broken and the main argument is never established.",
  "suggestions": [
    "Correct the factual claim in paragraph 2 — the date stated is incorrect.",
    "Add the missing introduction that establishes the article's purpose.",
    "Remove the contradictory statements in sections 3 and 5.",
    "Rewrite the conclusion — it currently argues the opposite of the introduction.",
    "Add sources for all statistical claims throughout the article."
  ],
  "severity": "error"
}
`;

	const taskPrompts: Record<AnalyzeArticleTask, string> = {
		[ANALYZE_ARTICLE_TASK.BUGS]: `${basePrompt}
Task: Find bugs, factual errors, logical inconsistencies, or broken reasoning in the article.
- Use "error" if critical factual mistakes or missing core content are found
- Use "warning" if there are minor inaccuracies or unverified claims
- Use "info" if the content appears accurate and logically sound
`,

		[ANALYZE_ARTICLE_TASK.EXPLAIN]: `${basePrompt}
Task: Evaluate how accessible and understandable the article is for a non-expert reader.
- Use "error" if the article is largely incomprehensible without prior domain knowledge
- Use "warning" if some sections use unexplained jargon or assume too much context
- Use "info" if the article is clear and approachable for a general audience
`,

		[ANALYZE_ARTICLE_TASK.OPTIMIZE]: `${basePrompt}
Task: Analyze the article for SEO effectiveness and readability optimization.
- Use "error" if the article has no clear structure, missing headings, or zero SEO value
- Use "warning" if there are concrete missed opportunities in structure, keywords, or formatting
- Use "info" if the article is already well-optimized with only minor improvements possible
`,

		[ANALYZE_ARTICLE_TASK.REVIEW]: `${basePrompt}
Task: Review the article for overall quality, clarity, and structure.
- Use "error" if the article has critical structural or content problems that undermine its value
- Use "warning" if there are noticeable gaps, unclear sections, or weak argumentation
- Use "info" if the article is well-written with only minor polish needed
`,
	};

	return taskPrompts[task];
}
