import { Injectable } from '@nestjs/common';
import { and, eq, inArray, notExists, relationsFilterToSQL, sql } from 'drizzle-orm';
import { CreateArticle } from 'shared/articles/schemas/create-article.schema';
import { GetArticlesWithPaginationQuery } from 'shared/articles/schemas/get-articles-with-pagination.query.schema';
import { UpdateArticle } from 'shared/articles/schemas/update-article.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { InjectDrizzle } from 'src/drizzle/decorators/drizzle.decorator';
import { DrizzleDb } from 'src/drizzle/types/drizzle-db';
import { calculatePagination } from 'src/drizzle/utils/calculate-pagination';

import * as schema from '../../drizzle/db/schema';
import { mapArticle } from '../mappers/articles.mapper';

@Injectable()
export class ArticlesRepository {
	constructor(@InjectDrizzle() private readonly db: DrizzleDb) {}

	private async findOneWithTx(tx: DrizzleDb, id: Id) {
		const result = await tx.query.articles.findFirst({
			where: { id },
			with: { author: true, category: true, tags: true },
		});
		return mapArticle(result);
	}

	private async upsertTags(tx: DrizzleDb, articleId: Id, tags: string[]) {
		if (tags.length === 0) return;

		const tagValues = tags.map((name) => ({ name }));

		const insertedTags = await tx
			.insert(schema.tags)
			.values(tagValues)
			.onConflictDoUpdate({
				target: schema.tags.name,
				set: { name: sql`excluded.name` },
			})
			.returning();

		const articleToTagValues = insertedTags.map((tag) => ({
			articleId,
			tagId: tag.id,
		}));

		await tx.insert(schema.articleToTag).values(articleToTagValues).onConflictDoNothing();
	}

	async findAll(getArticlesWithPaginationQuery: GetArticlesWithPaginationQuery) {
		const {
			status,
			categoryId,
			tag: tags,
			page,
			limit,
			sortBy,
			order,
		} = getArticlesWithPaginationQuery;

		const baseQuery = {
			where: {
				...(status !== undefined && { status }),
				...(categoryId !== undefined && { categoryId }),
				...(tags?.length && { tags: { name: { in: tags } } }),
			},
			orderBy: { [sortBy]: order },
			with: { author: true, category: true, tags: true },
		};

		if (!page) {
			const result = await this.db.query.articles.findMany(baseQuery);
			return result.map(mapArticle);
		}

		return await this.db.transaction(async (tx) => {
			const countSQL = relationsFilterToSQL(schema.articles, baseQuery.where);
			const total = await tx.$count(schema.articles, countSQL);
			if (total === 0) return { total, page, limit, data: [] };

			const { currentPage, offset } = calculatePagination(total, page, limit);

			const result = await tx.query.articles.findMany({
				...baseQuery,
				offset,
				limit,
			});

			const data = result.map(mapArticle);

			return { total, page: currentPage, limit, data };
		});
	}

	async findOne(id: Id) {
		return this.findOneWithTx(this.db, id);
	}

	async create(createArticle: CreateArticle) {
		const { tags, ...restCreateArticle } = createArticle;

		return await this.db.transaction(async (tx) => {
			const [article] = await tx.insert(schema.articles).values(restCreateArticle).returning();
			if (!article) return null;

			if (tags?.length) await this.upsertTags(tx, article.id, tags);

			return this.findOneWithTx(tx, article.id);
		});
	}

	async update(id: Id, updateArticle: UpdateArticle) {
		const { tags, ...restUpdateArticle } = updateArticle;

		return await this.db.transaction(async (tx) => {
			const [article] = await tx
				.update(schema.articles)
				.set(restUpdateArticle)
				.where(eq(schema.articles.id, id))
				.returning();

			if (!article) return null;

			if (Array.isArray(tags)) {
				await tx.delete(schema.articleToTag).where(eq(schema.articleToTag.articleId, id));
				if (tags.length) await this.upsertTags(tx, id, tags);
			}

			return this.findOneWithTx(tx, id);
		});
	}

	async remove(id: Id) {
		return await this.db.transaction(async (tx) => {
			const article = await tx.query.articles.findFirst({
				where: { id },
				with: { author: true, category: true, tags: true },
			});

			if (!article) return null;

			const tagIds = article.tags.map((tag) => tag.id);

			await tx.delete(schema.articles).where(eq(schema.articles.id, id));

			if (tagIds.length) {
				await tx
					.delete(schema.tags)
					.where(
						and(
							inArray(schema.tags.id, tagIds),
							notExists(
								tx
									.select({ id: schema.articleToTag.tagId })
									.from(schema.articleToTag)
									.where(eq(schema.articleToTag.tagId, schema.tags.id)),
							),
						),
					);
			}

			return mapArticle(article);
		});
	}
}
