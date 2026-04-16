import 'dotenv/config';
import { getTableName, sql, Table } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { relations } from './relations';
import * as schema from './schema';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle({ client: pool, schema, relations });

async function main() {
	console.log('🌱 Start seeding...');

	const tableNames = Object.values(schema)
		.filter((entity) => entity instanceof Table)
		.map((table) => `"${getTableName(table)}"`);

	if (tableNames.length > 0) {
		await db.execute(
			sql.raw(`TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY CASCADE;`),
		);
	}

	console.log('   🧹 Cleaned existing data');

	const usersData = [
		{ login: 'admin', password: 'Admin1234!', role: 'ADMIN' as const },
		{ login: 'editor', password: 'Editor1234!', role: 'EDITOR' as const },
		{ login: 'viewer', password: 'Viewer1234!', role: 'VIEWER' as const },
	];

	const [admin, editor, viewer] = await db.insert(schema.users).values(usersData).returning();

	console.log('   👤 Created users');

	const categoriesData = [
		{ name: 'Node.js', description: 'Everything about Node' },
		{ name: 'Databases', description: 'Postgresql, mongodb and others' },
		{ name: 'Frontend', description: 'Everything about Frontend' },
	];

	const [nodeJs, databases, frontend] = await db
		.insert(schema.categories)
		.values(categoriesData)
		.returning();

	console.log('   📁 Created categories');

	const tagsData = [
		{ name: 'node' },
		{ name: 'db' },
		{ name: 'nest' },
		{ name: 'js' },
		{ name: 'ts' },
		{ name: 'be' },
		{ name: 'fe' },
	];

	const [nodeTag, dbTag, nestTag, jsTag, tsTag, beTag, feTag] = await db
		.insert(schema.tags)
		.values(tagsData)
		.returning();

	console.log('   🔖 Created tags');

	const articlesContent = [
		{
			title: 'Node.js',
			status: 'DRAFT' as const,
			content:
				'Node.js is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more. It is built on the Chrome V8 engine and uses an asynchronous event-driven model, making it ideal for building scalable and high-performance network applications.',
			authorId: admin.id,
			categoryId: nodeJs.id,
			tags: [nodeTag, beTag],
		},
		{
			title: 'PostgreSQL or MongoDB?',
			status: 'PUBLISHED' as const,
			content:
				'Choosing between PostgreSQL and MongoDB depends on your applications needs for data structure and consistency. PostgreSQL is a powerful relational database that excels at complex queries and ACID compliance, while MongoDB is a popular NoSQL document store that offers horizontal scaling and a flexible JSON-like schema.',
			authorId: editor.id,
			categoryId: databases.id,
			tags: [dbTag, beTag],
		},
		{
			title: 'Why you should use NestJS?',
			status: 'ARCHIVED' as const,
			content:
				'NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It leverages TypeScript, combines elements of OOP, FP, and FRP, and provides an out-of-the-box application architecture that allows developers to create highly testable and maintainable code.',
			authorId: editor.id,
			categoryId: nodeJs.id,
			tags: [nodeTag, nestTag, beTag],
		},
		{
			title: 'How to use NestJS with PostgreSQL in Docker?',
			status: 'PUBLISHED' as const,
			content:
				'Containerizing your NestJS and PostgreSQL setup with Docker ensures environment consistency across development and production. By using docker-compose, you can easily orchestrate services, manage environment variables, and define persistent storage volumes for your database, simplifying the deployment pipeline.',
			authorId: editor.id,
			categoryId: nodeJs.id,
			tags: [nodeTag, nestTag, beTag],
		},
		{
			title: 'How to create fullstack app with only Next.js?',
			status: 'DRAFT' as const,
			content:
				'Next.js has evolved into a comprehensive framework that supports full-stack development through Server Components and Route Handlers. By integrating frontend logic with server-side API routes and database connections, developers can build complete, high-performance web applications within a single unified codebase.',
			authorId: editor.id,
			categoryId: nodeJs.id,
			tags: [nodeTag, tsTag, beTag, feTag],
		},
		{
			title: "You don't need TypeScript when existing JS code is perfect",
			status: 'ARCHIVED' as const,
			content:
				"While TypeScript provides valuable type safety and tooling for large projects, pure JavaScript remains a potent choice for smaller or legacy applications. If your existing code is well-tested and your team is highly proficient in JS, you might decide that the overhead of a build step and typing isn't necessary for every project.",
			authorId: editor.id,
			categoryId: nodeJs.id,
			tags: [nodeTag, jsTag, tsTag, beTag],
		},
		{
			title: 'How to create SPA with React Create App in 2026?',
			status: 'PUBLISHED' as const,
			content:
				'Creating a Single Page Application with specialized tools provides a streamlined development experience for rich client-side interfaces. In 2026, modern builders like Vite have largely superseded Create React App, offering significantly faster HMR and optimized production builds for building state-of-the-art SPAs.',
			authorId: editor.id,
			categoryId: frontend.id,
			tags: [jsTag, tsTag, feTag],
		},
	];

	const articles: (typeof schema.articles.$inferSelect)[] = [];
	for (const { tags, ...articleData } of articlesContent) {
		const [article] = await db.insert(schema.articles).values(articleData).returning();
		articles.push(article);

		if (tags && tags.length > 0) {
			await db.insert(schema.articleToTag).values(
				tags.map((tag) => ({
					articleId: article.id,
					tagId: tag.id,
				})),
			);
		}
	}

	console.log('   📝 Created articles');

	const commentTexts = [
		'🔥 Finally a proper guide on Node.js! Thanks!',
		"To be honest, the author didn't fully grasp the topic. Lots of mistakes.",
		'What about performance compared to Go? Has anyone tested it?',
		"Interesting approach, I'll have to try it on my next project.",
		'I disagree with the point about databases. PostgreSQL is better in any case.',
		'Too complex for a beginner. Could have been explained more simply.',
		'Awesome! Looking forward to the next article.',
		'Is there a code example on GitHub? It would be useful to check out.',
		'JS is pain, but the article is good. Made me think.',
		"Simply top-tier! Best thing I've read this week.",
		'Not this NestJS propaganda again... Write in pure Express!',
		'WTF? Why was this even published? Terrible quality.',
		'Thanks, helped me solve a bug I spent 3 hours on.',
		'Really useful, especially the section on architecture.',
		'Not enough examples. Would like to see more practice.',
		'Information is already outdated. Everything is different in the new version.',
		'First! 🚀',
		'This is the basics. Every developer should know this.',
		'What do you think about Bun? Is it worth switching?',
		'Writing style is fire! Reads in one breath.',
		"I don't understand why TypeScript is here. It just gets in the way.",
		"Good analysis, but I'd add a section on security.",
		'Does this work for mobile? Or only for web?',
		'Some kind of over-engineering. Could be 10 times simpler.',
		'Respect! A very fundamental breakdown.',
		"Has anyone tried this in production? Won't it crash under load?",
		"Kudos to the author for trying, but the topic isn't fully covered.",
		'Someone finally said it! Agree 100%.',
		'Tired of these new frameworks every single day...',
		'Best of the best! Bookmarked.',
	];

	const userIds = [admin.id, editor.id, viewer.id];

	await db.insert(schema.comments).values(
		commentTexts.map((text, index) => ({
			content: text,
			authorId: userIds[index % userIds.length],
			articleId: articles[index % articles.length].id,
		})),
	);

	console.log('   💬 Created comments');

	console.log('✅ Seeding finished');
	process.exit(0);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
