import type { ArticleWithRelationsEntity } from 'src/drizzle/db/schema';

export function generateArticlePrompt(article: ArticleWithRelationsEntity) {
	return `# Article

## Title:
${article.title}

## Body:
${article.content}

## Tags:
${article.tags.map((t) => t.name).join(', ')}`;
}
