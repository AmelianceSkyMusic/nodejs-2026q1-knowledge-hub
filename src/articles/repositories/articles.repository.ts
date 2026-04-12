import { Injectable } from '@nestjs/common';
import { CreateArticle } from 'src/_shared/articles/schemas/create-article.schema';
import { GetArticlesWithPaginationQuery } from 'src/_shared/articles/schemas/get-articles-with-pagination.query.schema';
import { UpdateArticle } from 'src/_shared/articles/schemas/update-article.schema';
import { Id } from 'src/_shared/common/schemas/id.schema';
import { PrismaService } from 'src/prisma/prisma.service';

import { mapArticle } from '../mappers/articles.mapper';

@Injectable()
export class ArticlesRepository {
	constructor(private prisma: PrismaService) {}

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

		const where = {
			status,
			categoryId,
			tags: tags && { some: { name: { in: tags } } },
		};

		if (!page) {
			const result = await this.prisma.article.findMany({
				orderBy: { [sortBy]: order },
				where,
				include: { author: true, category: true, tags: true },
			});
			return result.map(mapArticle);
		}

		return await this.prisma.$transaction(async (tx) => {
			const total = await tx.article.count({ where });
			if (total === 0) return { total, page, limit, data: [] };

			const pages = Math.ceil(total / limit) || 1;
			const currentPage = Math.min(Math.max(1, page), pages);
			const offset = (currentPage - 1) * limit;

			const result = await tx.article.findMany({
				skip: offset,
				take: limit,
				orderBy: { [sortBy]: order },
				where: where,
				include: { author: true, category: true, tags: true },
			});

			const data = result.map(mapArticle);

			return { total, page: currentPage, limit, data };
		});
	}

	async findOne(id: Id) {
		const result = await this.prisma.article.findUnique({
			where: { id },
			include: { author: true, category: true, tags: true },
		});
		if (!result) return null;
		return mapArticle(result);
	}

	async create(createArticle: CreateArticle) {
		const { tags, ...rest } = createArticle;
		const result = await this.prisma.article.create({
			data: {
				...rest,
				tags: {
					connectOrCreate: tags.map((tagName) => ({
						where: { name: tagName },
						create: { name: tagName },
					})),
				},
			},
			include: { author: true, category: true, tags: true },
		});
		return mapArticle(result);
	}

	async update(id: Id, updateArticle: UpdateArticle) {
		const { tags, ...rest } = updateArticle;
		const result = await this.prisma.article.update({
			data: {
				...rest,
				...(tags && {
					tags: {
						set: [],
						connectOrCreate: tags.map((tagName) => ({
							where: { name: tagName },
							create: { name: tagName },
						})),
					},
				}),
			},
			where: { id },
			include: { author: true, category: true, tags: true },
		});
		return mapArticle(result);
	}

	async remove(id: Id) {
		return await this.prisma.$transaction(async (tx) => {
			const deletedArticle = await tx.article.delete({
				where: { id },
				include: {
					tags: {
						select: { id: true },
					},
				},
			});

			const tagIds = deletedArticle.tags.map((tag) => tag.id);

			if (tagIds.length > 0) {
				await tx.tag.deleteMany({
					where: { id: { in: tagIds }, articles: { none: {} } },
				});
			}

			return deletedArticle;
		});
	}
}
