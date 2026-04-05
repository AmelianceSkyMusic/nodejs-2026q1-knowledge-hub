import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CommentsService } from 'src/comments/comments.service';
import { Id } from 'src/common/types/id';
import { sort } from 'src/common/utils/sort.util';

import { CreateArticleRequestDto } from './dto/request/create-article.request.dto';
import { GetArticlesWithPaginationQueryRequestDto } from './dto/request/get-articles-with-pagination-query.request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article.request.dto';
import { ArticlesRepository } from './repositories/articles.repository';

import { ORDER } from '../common/constants/order';
import { ARTICLE_SORT_BY } from './constants/article-sort-by';
import { ERROR } from 'src/common/constants/error';

@Injectable()
export class ArticlesService {
	constructor(
		@Inject(forwardRef(() => CommentsService))
		private readonly commentsService: CommentsService,
		private readonly articlesRepository: ArticlesRepository,
	) {}

	findAll(getArticlesWithPaginationQueryRequestDto: GetArticlesWithPaginationQueryRequestDto) {
		const {
			status,
			categoryId,
			tag: tags,
			page,
			limit = 10,
			sortBy = ARTICLE_SORT_BY.CREATED_AT,
			order = ORDER.DESC,
		} = getArticlesWithPaginationQueryRequestDto;

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

	create(createArticleRequestDto: CreateArticleRequestDto) {
		const newArticle = {
			...createArticleRequestDto,
			authorId: createArticleRequestDto.authorId ?? null,
			categoryId: createArticleRequestDto.categoryId ?? null,
			tags: createArticleRequestDto.tags ?? [],
			status: createArticleRequestDto.status ?? 'draft',
			id: randomUUID(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		return this.articlesRepository.create(newArticle);
	}

	update(id: Id, updateArticleRequestDto: UpdateArticleRequestDto) {
		const article = this.articlesRepository.findOne(id);
		if (!article) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);

		const updatedArticle = {
			...article,
			...updateArticleRequestDto,
			updatedAt: Date.now(),
		};
		return this.articlesRepository.update(id, updatedArticle);
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
