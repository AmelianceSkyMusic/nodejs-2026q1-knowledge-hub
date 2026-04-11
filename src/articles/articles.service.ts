import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Id } from 'src/_shared/common/schemas/id.schema';
import { CommentsService } from 'src/comments/comments.service';
import { sort } from 'src/common/utils/sort.util';

import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesWithPaginationQueryDto } from './dto/get-articles-with-pagination.query.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesRepository } from './repositories/articles.repository';

import { ERROR } from 'src/_shared/common/constants/error';

@Injectable()
export class ArticlesService {
	constructor(
		@Inject(forwardRef(() => CommentsService))
		private readonly commentsService: CommentsService,
		private readonly articlesRepository: ArticlesRepository,
	) {}

	findAll(getArticlesWithPaginationQueryDto: GetArticlesWithPaginationQueryDto) {
		const {
			status,
			categoryId,
			tag: tags,
			page,
			limit,
			sortBy,
			order,
		} = getArticlesWithPaginationQueryDto;

		const allArticles = this.articlesRepository.findAll();
		if (!status && !categoryId && !tags && !page) return sort(allArticles, sortBy, order);

		const filtered = allArticles.filter(
			(article) =>
				(!status || article.status === status) &&
				(!categoryId || article.categoryId === categoryId) &&
				(!tags || article.tags.some((t) => tags.includes(t))),
		);

		const filteredAndSorted = sort(filtered, sortBy, order);
		if (!page) return filteredAndSorted;

		const offset = (page - 1) * limit;

		const paginatedData = filteredAndSorted.slice(offset, offset + limit);

		return {
			total: filteredAndSorted.length,
			page: Number(page),
			limit: Number(limit),
			data: paginatedData,
		};
	}

	findOne(id: Id) {
		return this.articlesRepository.findOne(id);
	}

	create(createArticleDto: CreateArticleDto) {
		const timestamp = Date.now();
		const newArticle = {
			...createArticleDto,
			id: randomUUID(),
			createdAt: timestamp,
			updatedAt: timestamp,
		};
		return this.articlesRepository.create(newArticle);
	}

	update(id: Id, updateArticleDto: UpdateArticleDto) {
		const article = this.articlesRepository.findOne(id);
		if (!article) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);

		const updatedArticle = {
			...article,
			...updateArticleDto,
			updatedAt: Date.now(),
		};

		const result = this.articlesRepository.update(id, updatedArticle);
		if (!result) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);

		return result;
	}

	remove(id: Id) {
		const article = this.articlesRepository.findOne(id);
		if (!article) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);

		this.commentsService.removeByArticleId(id);

		return this.articlesRepository.remove(id);
	}

	nullifyCategory(categoryId: Id) {
		this.articlesRepository.nullifyCategory(categoryId);
	}

	nullifyAuthor(authorId: Id) {
		this.articlesRepository.nullifyAuthor(authorId);
	}
}
