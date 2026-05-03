import 'dotenv/config';
import { hash } from 'bcrypt';
import { getTableName, sql, Table } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { relations } from './relations';
import * as schema from './schema';

import { ARTICLE_STATUS } from 'shared/articles/constants/article-status';
import { USER_ROLES } from 'shared/users/constants/user-role';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle({
	client: pool,
	schema,
	relations,
	casing: 'snake_case',
});

const hashPassword = async (password: string) => await hash(password, 10);

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
		{ login: 'admin', password: await hashPassword('Admin1234!'), role: USER_ROLES.ADMIN },
		{ login: 'editor', password: await hashPassword('Editor1234!'), role: USER_ROLES.EDITOR },
		{ login: 'viewer', password: await hashPassword('Viewer1234!'), role: USER_ROLES.VIEWER },
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
		{ name: 'nest' },
		{ name: 'db' },
		{ name: 'performance' },
		{ name: 'security' },
		{ name: 'microservices' },
		{ name: 'docker' },
		{ name: 'clean-code' },
		{ name: 'scaling' },
		{ name: 'typescript' },
		{ name: 'frontend' },
		{ name: 'react' },
		{ name: 'ui' },
	];

	const tags = await db.insert(schema.tags).values(tagsData).returning();
	const findTag = (name: string) => tags.find((t) => t.name === name)!;

	console.log('   🔖 Created tags');

	const articlesContent = [
		{
			title: 'Node.js Performance: Mastering the Event Loop',
			status: ARTICLE_STATUS.PUBLISHED,
			content: `Node.js is often praised for its performance, but understanding why it performs well is crucial for any senior developer. At the heart of Node.js lies the Event Loop, a mechanism that allows it to perform non-blocking I/O operations despite being single-threaded. This article dives deep into the internals of libuv and the phases of the event loop.

We begin by exploring the 'Timers' phase, where setTimeout and setInterval callbacks are executed. Many developers mistakenly believe that these timers trigger exactly at the specified millisecond, but in reality, they are processed during the next available loop iteration after the timer expires. This subtle difference can lead to race conditions in complex applications.

Next, we move to the 'Pending Callbacks' phase. This is where the system processes I/O errors that were deferred from previous iterations. Understanding this phase is key to debugging low-level network issues that seem to happen 'out of nowhere'.

The 'Poll' phase is perhaps the most important. It's where the event loop retrieves new I/O events. If the queue is empty, the loop might block here to wait for incoming connections or data, but only if there are no pending timers or immediate callbacks. This is how Node.js manages to stay idle without burning CPU cycles.

We also examine the 'Check' phase, dedicated to setImmediate. While it sounds similar to process.nextTick, they behave differently. setImmediate is designed to run after the current poll phase, whereas nextTick fires immediately after the current operation, potentially starving the event loop if misused.

Modern Node.js also introduces Worker Threads. While the event loop handles I/O efficiently, CPU-intensive tasks like image processing or cryptography can block the thread. Worker threads allow us to offload these tasks to separate threads, sharing memory through SharedArrayBuffer for maximum efficiency.

Performance optimization doesn't stop at the event loop. Garbage collection in the V8 engine plays a huge role. By monitoring heap usage and avoiding memory leaks, we can prevent the 'Stop-the-world' pauses that degrade user experience. Tools like clinics.js and the built-in inspector are invaluable here.

Furthermore, we discuss the impact of asynchronous programming patterns. Promises and async/await have simplified code significantly, but they add overhead. In ultra-high-performance scenarios, raw callbacks might still be preferred, though the trade-off in maintainability is usually too high.

Cluster module is another tool in our arsenal. By spawning one process per CPU core, we can fully utilize the server's hardware. However, this introduces challenges in state management, requiring external stores like Redis for session or cache sharing across workers.

Finally, we look at the future of Node.js with the introduction of the Permission Model and built-in test runners. These features aim to make Node.js more secure and self-contained, reducing the reliance on third-party packages for core functionality.

In conclusion, mastering Node.js requires more than just knowing the API. It requires a mental model of how the underlying engine processes tasks, manages memory, and interacts with the operating system. Only then can we build truly scalable systems.`,
			authorId: admin.id,
			categoryId: nodeJs.id,
			tags: ['node', 'performance', 'scaling'],
		},
		{
			title: 'The Evolution of Modern Database Architecture',
			status: ARTICLE_STATUS.PUBLISHED,
			content: `In the early days of web development, the choice was simple: use a relational database like MySQL or PostgreSQL. Today, the landscape is vastly more complex, with NoSQL, NewSQL, and Multi-model databases vying for attention. Choosing the right architecture can make or break a project's long-term viability.

Relational databases remain the gold standard for data consistency. Thanks to ACID (Atomicity, Consistency, Isolation, Durability) properties, they ensure that every transaction is processed reliably. For financial systems or any application where data integrity is paramount, SQL is still the king.

However, as web applications grew to handle millions of concurrent users, the limitations of vertical scaling in SQL became apparent. This gave rise to the NoSQL movement. Databases like MongoDB and Cassandra prioritized availability and partition tolerance over strict consistency, following the CAP theorem.

Document stores like MongoDB introduced a flexible schema-less approach. This allowed developers to iterate quickly without complex migrations. But this flexibility came at a cost: joins were slow or non-existent, forcing developers to denormalize data and handle relationships in the application logic.

Then came the 'NewSQL' era. Systems like CockroachDB and Google Spanner aimed to provide the best of both worlds: the strict consistency of SQL with the horizontal scalability of NoSQL. They achieve this through sophisticated consensus algorithms like Paxos or Raft, and synchronized atomic clocks.

In 2026, we see a convergence of these technologies. PostgreSQL now has excellent JSONB support, making it a viable alternative to MongoDB for many use cases. Conversely, MongoDB has introduced multi-document ACID transactions, closing the gap with relational systems.

We also examine specialized databases. Vector databases like Pinecone or Milvus are exploding in popularity due to the AI boom. They are optimized for storing and searching high-dimensional embeddings, which is the foundation of modern Large Language Models and recommendation engines.

Graph databases like Neo4j provide unique advantages for social networks and fraud detection. By treating relationships as first-class citizens, they can traverse complex networks in milliseconds, a task that would require dozens of expensive joins in a relational database.

Time-series databases like InfluxDB or TimescaleDB are essential for IoT and monitoring. They are optimized for high-write loads and efficient querying of data over time, often including built-in functions for downsampling and data retention policies.

Distributed caching layers like Redis and Memcached remain critical for performance. By offloading frequent reads from the primary database to RAM, they can reduce latency from milliseconds to microseconds. Modern Redis also supports persistence and complex data types like Streams and JSON.

Ultimately, the trend is moving towards 'Polyglot Persistence'. Instead of trying to fit every use case into a single database, modern architectures use multiple specialized stores, synchronized through Change Data Capture (CDC) or event-driven patterns.

Understanding these trade-offs is the mark of a true software architect. There is no 'best' database, only the right tool for the specific constraints of the problem at hand.`,
			authorId: editor.id,
			categoryId: databases.id,
			tags: ['db', 'scaling', 'microservices'],
		},
		{
			title: 'NestJS Best Practices: Building Enterprise-Grade APIs',
			status: ARTICLE_STATUS.PUBLISHED,
			content: `NestJS has become the go-to framework for enterprise Node.js applications. Inspired by Angular, it brings a level of structure and discipline to backend development that was previously missing in the ecosystem. But with great power comes the responsibility to use it correctly.

At the core of NestJS is Dependency Injection (DI). While it might seem like boilerplate at first, DI is the secret to building decoupled and testable services. By injecting interfaces rather than concrete implementations, we can easily swap out production services for mocks during unit testing.

Modular architecture is another pillar of Nest. Every feature should reside in its own module, encapsulating its controllers, services, and repositories. This not only makes the code easier to navigate but also enables 'Lazy Loading' in microservice environments, reducing startup times.

We must discuss the role of Providers. In Nest, almost everything is a provider: services, repositories, factories, and even helpers. Understanding the 'Scope' of these providers—Singleton, Request, or Transient—is vital for managing state and performance across requests.

Controllers should be thin. Their only responsibility is to handle incoming requests, validate the input using Pipes and DTOs, and delegate the business logic to services. If your controller is more than 50 lines long, it's likely doing too much and needs refactoring.

Services are where the 'magic' happens. This is where the domain logic lives. By keeping services focused and small, we can ensure they are reusable across different controllers or even different modules. Always use Zod or Class-Validator to ensure data entering the service is valid.

Middleware, Guards, and Interceptors provide powerful ways to handle cross-cutting concerns. Guards are perfect for authentication and authorization, while Interceptors can transform responses or log execution times. Pipes are the right place for data transformation and validation.

Exception handling in Nest is elegant thanks to Exception Filters. Instead of littering your code with try-catch blocks, you can define global or scoped filters that catch specific errors and format the response consistently for the client.

Integration with ORMs like Drizzle or TypeORM should be handled through the 'Repository Pattern'. This abstracts the database logic away from the service, making it easier to switch databases or ORMs in the future without touching the business logic.

Testing is where NestJS really shines. The built-in TestingModule provides a powerful API for creating an isolated application context for unit and integration tests. Combined with Jest and Supertest, it allows for high coverage with minimal effort.

Documentation is often overlooked, but the Swagger integration in Nest is too good to ignore. By adding a few decorators to your DTOs and controllers, you get a fully interactive API documentation that stays in sync with your code automatically.

As we look toward 2026, NestJS continues to evolve, with better support for Microservices, WebSockets, and even serverless deployments. By following these best practices, you can build applications that are not only powerful but also a joy to maintain over the years.`,
			authorId: admin.id,
			categoryId: nodeJs.id,
			tags: ['nest', 'clean-code', 'typescript'],
		},
		{
			title: 'Microservices: Beyond the Hype',
			status: ARTICLE_STATUS.PUBLISHED,
			content: `Microservices have been the 'gold standard' for large-scale systems for nearly a decade. But as many companies have discovered, they are not a silver bullet. Moving from a monolith to microservices is a journey fraught with complexity and hidden costs.

The primary benefit of microservices is organizational. They allow teams to work independently, deploying their own services on their own schedules. This 'Decoupling' is essential for companies with hundreds of developers where a single monolith would become a bottleneck.

However, microservices introduce the 'Distributed Systems' problem. Once you break a monolith apart, you lose the simplicity of local function calls. Every interaction becomes a network call, introducing latency, partial failures, and the need for complex service discovery.

Data consistency becomes a major challenge. In a monolith, you have one database and ACID transactions. In microservices, each service has its own database. Achieving consistency across services requires patterns like 'Sagas' or 'Two-Phase Commit', which are notoriously difficult to implement.

Observability is non-negotiable. You cannot manage 50 services without centralized logging, metrics, and distributed tracing. Tools like ELK stack, Prometheus, and Jaeger become mandatory parts of your infrastructure, not just optional extras.

Service-to-service communication can be synchronous (REST, gRPC) or asynchronous (Message Queues). While REST is easier to debug, Message Queues like RabbitMQ or Kafka provide better resilience by decoupling the producer from the consumer.

Deployment becomes a hurdle. Docker and Kubernetes are the standard solutions here, but they add another layer of complexity. Managing K8s clusters requires specialized DevOps knowledge that many smaller teams might not have.

The 'Service Mesh' (like Istio or Linkerd) has emerged to handle low-level concerns like retries, circuit breaking, and mTLS between services. This offloads the complexity from the application code to the infrastructure, but at the cost of even more YAML files to manage.

Security in microservices is also more complex. You need a centralized Identity Provider (IdP) and a way to propagate user context across services, usually through JWTs. Each service must also be secured against internal threats, following the 'Zero Trust' model.

Testing microservices requires a shift in strategy. Unit tests are still important, but 'Contract Testing' (using tools like Pact) is essential to ensure that a change in one service doesn't break its consumers. Integration tests also become more expensive and slower.

In many cases, a 'Modular Monolith' might be a better choice. It provides the logical separation of microservices without the operational overhead. You can always split a modular monolith into microservices later when the scale truly demands it.

In conclusion, microservices are a tool for managing scale, both in terms of traffic and organizational size. They should be chosen based on real needs, not just because they are the current trend in the industry.`,
			authorId: editor.id,
			categoryId: nodeJs.id,
			tags: ['microservices', 'scaling', 'docker'],
		},
		{
			title: 'Security-First Development: Protecting Your API',
			status: ARTICLE_STATUS.PUBLISHED,
			content: `In an era of constant data breaches, security can no longer be an afterthought. Building a 'Security-First' culture means integrating protection at every stage of the development lifecycle, from the first line of code to the final deployment.

Authentication is the first line of defense. While JWTs are popular, they are often misused. Always use short-lived access tokens and secure, HTTP-only cookies for refresh tokens. Never store sensitive data in the JWT payload, as it can be easily decoded by anyone.

Authorization is just as important. Knowing *who* the user is doesn't tell you *what* they can do. Implement Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC) and ensure that every single endpoint is protected by a guard.

Input validation is the best way to prevent SQL Injection and Cross-Site Scripting (XSS). Use libraries like Zod or Joi to strictly validate every piece of data that comes from the user. Never trust the client; if it's not validated, it's dangerous.

Data at rest and in transit must be encrypted. Use TLS 1.3 for all network communication and strong algorithms like AES-256 for storing sensitive fields in your database. For passwords, Argon2 or BCrypt are the only acceptable choices in 2026.

Rate limiting and Throttling are essential to prevent Denial of Service (DoS) attacks. By limiting the number of requests a user can make in a given timeframe, you protect your server's resources and ensure availability for all users.

Dependency management is a major security vector. Modern applications rely on thousands of third-party packages. Use tools like 'npm audit' or Snyk to scan for known vulnerabilities in your node_modules and keep your dependencies updated.

Logging and auditing allow you to detect and investigate security incidents. Log every failed login attempt, every administrative action, and every access to sensitive data. But be careful not to log sensitive data like passwords or tokens themselves!

Security headers like Content Security Policy (CSP), HSTS, and X-Frame-Options provide another layer of defense in the browser. They tell the browser which scripts are allowed to run and prevent attacks like Clickjacking.

Regular security audits and penetration testing are vital. Even the best developers make mistakes. Having a fresh pair of eyes look at your system can reveal vulnerabilities that you might have missed.

Finally, educate your team. Security is everyone's responsibility. Regular training on the OWASP Top 10 and secure coding practices will pay off far more than any single security tool.

Building secure software is a continuous process. As attackers become more sophisticated, so must our defenses. A proactive, multi-layered approach is the only way to keep your users' data safe in today's hostile internet.`,
			authorId: admin.id,
			categoryId: databases.id,
			tags: ['security', 'clean-code', 'performance'],
		},
		{
			title: 'Modern Frontend: The State of Web UI in 2026',
			status: ARTICLE_STATUS.PUBLISHED,
			content: `The frontend landscape in 2026 is unrecognizable compared to a decade ago. We have moved beyond simple DOM manipulation into an era of high-performance, AI-driven, and highly accessible user interfaces. This article explores the key trends shaping the modern web experience.

The dominance of React continues, but the focus has shifted entirely to 'Server Components'. By moving the majority of the logic to the server, we can ship zero kilobytes of JavaScript to the client for static parts of the page. This has revolutionized web performance, especially on low-end mobile devices.

Micro-frontends have matured from a experimental pattern into a standard for large enterprise applications. They allow teams to deploy parts of the UI independently, using the best tool for each specific job. However, the overhead of coordination remains a challenge that requires strong architectural governance.

WebAssembly (Wasm) is now a first-class citizen in the browser. From complex image editors to high-speed data processing, Wasm allows us to run near-native code in the web. This has opened the door for a new generation of 'Heavy' web applications that were previously only possible as desktop software.

AI-driven UI components are the new standard. Interfaces now adapt in real-time to user behavior, predicting what the user wants to do next and simplifying the journey. This 'Generative UI' approach requires a shift in how we think about design systems and component libraries.

Accessibility (a11y) is no longer a checklist; it's a core requirement. Modern browsers and screen readers have become more sophisticated, and frameworks now provide built-in tools that prevent developers from shipping inaccessible code. In 2026, a non-accessible site is considered a broken site.

State management has simplified. With the rise of fine-grained reactivity and 'Signals', the days of complex Redux boilerplates are largely over. State is now local by default, and global state is handled through lightweight, observable patterns that provide predictable performance.

CSS has seen a massive evolution with features like Container Queries, Subgrid, and Native Nesting. We no longer need preprocessors like Sass or complex CSS-in-JS libraries for basic functionality. CSS is now more powerful and expressive than ever before.

Performance monitoring has moved from the lab to the real world. Core Web Vitals are still the benchmark, but we now focus on 'Interaction to Next Paint' (INP) as the primary metric for responsiveness. Continuous monitoring of real-user sessions allows teams to catch and fix regressions in minutes.

The role of the 'Frontend Developer' has expanded. It now requires knowledge of server-side rendering, edge computing, and even basic machine learning. The line between frontend and backend continues to blur, leading to the rise of the 'Full-stack UI Engineer'.

In conclusion, the modern frontend is about more than just pixels on a screen. It's about delivering high-performance, accessible, and intelligent experiences that work seamlessly across a vast array of devices and network conditions.`,
			authorId: editor.id,
			categoryId: frontend.id,
			tags: ['frontend', 'react', 'ui'],
		},
	];

	const articles: (typeof schema.articles.$inferSelect)[] = [];
	for (const { tags: articleTags, ...articleData } of articlesContent) {
		const [article] = await db.insert(schema.articles).values(articleData).returning();
		articles.push(article);

		if (articleTags && articleTags.length > 0) {
			await db.insert(schema.articleToTag).values(
				articleTags.map((tagName) => ({
					articleId: article.id,
					tagId: findTag(tagName).id,
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
