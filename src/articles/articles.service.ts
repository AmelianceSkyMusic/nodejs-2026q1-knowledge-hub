import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CommentsService } from 'src/comments/comments.service';
import { Id } from 'src/common/types/id';

import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesQueryDto } from './dto/get-articles-query-dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesRepository } from './repositories/articles.repository';

import { ERROR } from 'src/common/constants/error';

@Injectable()
export class ArticlesService {
	constructor(
		@Inject(forwardRef(() => CommentsService))
		private readonly commentsService: CommentsService,
		private readonly articlesRepository: ArticlesRepository,
	) {}

	findAllByQuery(getArticlesQueryDto: GetArticlesQueryDto) {
		const { status, categoryId, tag } = getArticlesQueryDto;

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

	create(createArticleDto: CreateArticleDto) {
		const newArticle = {
			...createArticleDto,
			authorId: createArticleDto.authorId ?? null,
			categoryId: createArticleDto.categoryId ?? null,
			tags: createArticleDto.tags ?? [],
			status: createArticleDto.status ?? 'draft',
			id: randomUUID(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
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
