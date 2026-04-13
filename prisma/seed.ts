import { PrismaPg } from '@prisma/adapter-pg';
import { ArticleStatus, PrismaClient } from 'src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

async function main() {
	console.log('🌱 Start seeding...');

	await prisma.user.deleteMany();
	await prisma.comment.deleteMany();
	await prisma.article.deleteMany();
	await prisma.category.deleteMany();
	await prisma.tag.deleteMany();

	const users = [
		{ login: 'admin', password: 'Admin1234!', role: 'ADMIN' },
		{ login: 'editor', password: 'Editor1234!', role: 'EDITOR' },
		{ login: 'viewer', password: 'Viewer1234!', role: 'VIEWER' },
	] as const;

	const [admin, editor, viewer] = await Promise.all(
		users.map((user) => {
			return prisma.user.upsert({
				where: { login: user.login },
				update: {},
				create: {
					login: user.login,
					password: user.password,
					role: user.role,
				},
			});
		}),
	);

	const categories = [
		{ name: 'Node.js', description: 'Everything about Node' },
		{ name: 'Databases', description: 'Postgresql, mongodb and others' },
		{ name: 'Frontend', description: 'Everything about Frontend' },
	] as const;

	const [nodeJs, databases, frontend] = await Promise.all(
		categories.map((category) => {
			return prisma.category.create({
				data: {
					name: category.name,
					description: category.description,
				},
			});
		}),
	);

	const tags = [
		{ name: 'node' },
		{ name: 'db' },
		{ name: 'nest' },
		{ name: 'js' },
		{ name: 'ts' },
		{ name: 'be' },
		{ name: 'fe' },
	] as const;

	const [node, db, nest, js, ts, be, fe] = await Promise.all(
		tags.map((tag) => {
			return prisma.tag.upsert({
				where: { name: tag.name },
				update: {},
				create: {
					name: tag.name,
				},
			});
		}),
	);

	const articlesContent = [
		{
			title: 'Node.js',
			status: ArticleStatus.DRAFT,
			content:
				'Node.js is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more. It is built on the Chrome V8 engine and uses an asynchronous event-driven model, making it ideal for building scalable and high-performance network applications.',
			authorId: admin.id,
			categoryId: nodeJs.id,
			tags: {
				connect: [{ id: node.id }, { id: be.id }],
			},
		},
		{
			title: 'PostgreSQL or MongoDB?',
			status: ArticleStatus.PUBLISHED,
			content:
				'Choosing between PostgreSQL and MongoDB depends on your applications needs for data structure and consistency. PostgreSQL is a powerful relational database that excels at complex queries and ACID compliance, while MongoDB is a popular NoSQL document store that offers horizontal scaling and a flexible JSON-like schema.',
			authorId: editor.id,
			categoryId: databases.id,
			tags: {
				connect: [{ id: db.id }, { id: be.id }],
			},
		},
		{
			title: 'Why you should use NestJS?',
			status: ArticleStatus.ARCHIVED,
			content:
				'NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It leverages TypeScript, combines elements of OOP, FP, and FRP, and provides an out-of-the-box application architecture that allows developers to create highly testable and maintainable code.',
			authorId: editor.id,
			categoryId: nodeJs.id,
			tags: {
				connect: [{ id: node.id }, { id: nest.id }, { id: be.id }],
			},
		},
		{
			title: 'How to use NestJS with PostgreSQL in Docker?',
			status: ArticleStatus.PUBLISHED,
			content:
				'Containerizing your NestJS and PostgreSQL setup with Docker ensures environment consistency across development and production. By using docker-compose, you can easily orchestrate services, manage environment variables, and define persistent storage volumes for your database, simplifying the deployment pipeline.',
			authorId: editor.id,
			categoryId: nodeJs.id,
			tags: {
				connect: [{ id: node.id }, { id: nest.id }, { id: be.id }],
			},
		},
		{
			title: 'How to create fullstack app with only Next.js?',
			status: ArticleStatus.DRAFT,
			content:
				'Next.js has evolved into a comprehensive framework that supports full-stack development through Server Components and Route Handlers. By integrating frontend logic with server-side API routes and database connections, developers can build complete, high-performance web applications within a single unified codebase.',
			authorId: editor.id,
			categoryId: nodeJs.id,
			tags: {
				connect: [{ id: node.id }, { id: ts.id }, { id: be.id }, { id: fe.id }],
			},
		},
		{
			title: "You don't need TypeScript when existing JS code is perfect",
			status: ArticleStatus.ARCHIVED,
			content:
				"While TypeScript provides valuable type safety and tooling for large projects, pure JavaScript remains a potent choice for smaller or legacy applications. If your existing code is well-tested and your team is highly proficient in JS, you might decide that the overhead of a build step and typing isn't necessary for every project.",
			authorId: editor.id,
			categoryId: nodeJs.id,
			tags: {
				connect: [{ id: node.id }, { id: js.id }, { id: ts.id }, { id: be.id }],
			},
		},
		{
			title: 'How to create SPA with React Create App in 2026?',
			status: ArticleStatus.PUBLISHED,
			content:
				'Creating a Single Page Application with specialized tools provides a streamlined development experience for rich client-side interfaces. In 2026, modern builders like Vite have largely superseded Create React App, offering significantly faster HMR and optimized production builds for building state-of-the-art SPAs.',
			authorId: editor.id,
			categoryId: frontend.id,
			tags: {
				connect: [{ id: js.id }, { id: ts.id }, { id: fe.id }],
			},
		},
	];

	const articles = await Promise.all(
		articlesContent.map((article) => {
			return prisma.article.create({
				data: article,
			});
		}),
	);

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

	await Promise.all(
		commentTexts.map((text, index) => {
			return prisma.comment.create({
				data: {
					content: text,
					authorId: userIds[index % userIds.length],
					articleId: articles[index % articles.length].id,
				},
			});
		}),
	);

	console.log('✅ Seeding finished.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
