import { SWAGGER } from 'src/common/constants/swagger';

export const RAG_SWAGGER = {
	ONLY_PUBLISHED: {
		description: 'Only published articles will be indexed',
		example: true,
	},
	ARTICLE_IDS: {
		description: 'Array of article IDs to be indexed',
		example: [SWAGGER.EXAMPLE.ID],
	},
	INDEXED_ARTICLES: {
		description: 'Number of indexed articles',
		example: 435,
	},
	INDEXED_CHUNKS: {
		description: 'Number of indexed chunks',
		example: 214243,
	},
	VECTOR_COLLECTION: {
		description: 'Name of the vector collection',
		example: 'knowledge-hub-articles',
	},
	QUERY: {
		description: 'The query to be searched in the knowledge base',
		example: 'How to index articles in the knowledge base?',
	},
	LIMIT: {
		description: 'The maximum number of results to return',
		example: 5,
	},
	ARTICLE_STATUS: {
		description: 'The status of the articles to be searched',
		example: 'published',
	},
	CATEGORY_ID: {
		description: 'The ID of the category to be searched',
		example: SWAGGER.EXAMPLE.ID,
	},
	TAGS: {
		description: 'Array of tags to be searched',
		example: [SWAGGER.EXAMPLE.ID],
	},
	ARTICLE_ID: {
		description: 'The unique identifier of the article',
		example: SWAGGER.EXAMPLE.ID,
	},
	ARTICLE_TITLE: {
		description: 'The title of the article',
		example: 'How to index articles in the knowledge base?',
	},
	CHUNK: {
		description: 'The chunk of the article',
		example: 'Some chunk of the article',
	},
	SIMILARITY: {
		description: 'The similarity of the chunk',
		example: 0.9,
	},
	QUESTION: {
		description: 'The question to be answered',
		example: 'How to index articles in the knowledge base?',
	},
	CONVERSATION_ID: {
		description: 'The unique identifier of the conversation',
		example: SWAGGER.EXAMPLE.ID,
	},
	ANSWER: {
		description: 'The answer to the question',
		example: 'Some answer to the question',
	},
	SOURCES: {
		description: 'The sources used to generate the answer',
		example: [
			{
				articleId: SWAGGER.EXAMPLE.ID,
				articleTitle: 'How to index articles in the knowledge base?',
				relevantChunk: 'Some chunk of the article',
			},
		],
	},
	RELEVANT_CHUNK: {
		description: 'The relevant chunk of the article',
		example: 'Some relevant chunk of the article',
	},
	RESULTS: {
		description: 'The array of semantic search results',
		example: [
			{
				articleId: SWAGGER.EXAMPLE.ID,
				articleTitle: 'How to index articles in the knowledge base?',
				chunk: 'Some chunk of the article',
				similarity: 0.9,
			},
		],
	},
};
