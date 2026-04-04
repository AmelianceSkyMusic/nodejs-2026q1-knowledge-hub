import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CommentsService } from 'src/comments/comments.service';
import { Id } from 'src/common/types/id';

import { CreateArticleRequestDto } from './dto/request/create-article.request.dto';
import { GetArticlesQueryRequestDto } from './dto/request/get-articles-query.request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article.request.dto';
import { ArticlesRepository } from './repositories/articles.repository';

import { ERROR } from 'src/common/constants/error';

@Injectable()
export class ArticlesService {
	constructor(
		@Inject(forwardRef(() => CommentsService))
		private readonly commentsService: CommentsService,
		private readonly articlesRepository: ArticlesRepository,
	) {}

	findAllByQuery(getArticlesQueryRequestDto: GetArticlesQueryRequestDto) {
		const { status, categoryId, tag } = getArticlesQueryRequestDto;

		const allArticles = this.articlesRepository.findAll();
		if (!status && !categoryId && !tag) return allArticles;

		const filtered = allArticles.filter(
			(article) =>
				(!status || article.status === status) &&
				(!categoryId || article.categoryId === categoryId) &&
				(!tag || article.tags.includes(tag)),
		);
		return filtered;
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
