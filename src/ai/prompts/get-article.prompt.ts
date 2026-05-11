import type { Article } from 'shared/articles/schemas/article.schema';

export function generateArticlePrompt(article: Article) {
	return `# Article

## Title:
${article.title}

## Body:
${article.content}

## Tags:
${article.tags.join(', ')}`;
}
