import { Injectable } from '@nestjs/common';
import { CreateArticle } from 'shared/articles/schemas/create-article.schema';
import { GetArticlesWithPaginationQuery } from 'shared/articles/schemas/get-articles-with-pagination.query.schema';
import { UpdateArticle } from 'shared/articles/schemas/update-article.schema';
import { JwtUser } from 'shared/auth/schemas/jwt-user.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { BadRequestError } from 'src/common/errors/bad-request.error';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { InternalServerError } from 'src/common/errors/internal-server.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { pgError } from 'src/common/utils/pg-error';

import { ArticleMapper } from './mappers/article.mapper';
import { ArticlesRepository } from './repositories/articles.repository';
import { FindMany } from './types/find-many';

import { ARTICLE_STATUS_TRANSITIONS } from 'shared/articles/constants/article-status-transitions';
import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

@Injectable()
export class ArticlesService {
	constructor(private readonly articlesRepository: ArticlesRepository) {}

	async findAll(getArticlesWithPaginationQuery: GetArticlesWithPaginationQuery) {
		const result = await this.articlesRepository.findAll(getArticlesWithPaginationQuery);
		if ('data' in result) {
			return { ...result, data: ArticleMapper.toArticles(result.data) };
		}
		return ArticleMapper.toArticles(result);
	}

	async findManyWithRelations(findManyArgs: FindMany) {
		const result = await this.articlesRepository.findMany(findManyArgs);
		return ArticleMapper.toArticlesWithRelations(result);
	}

	async findOne(id: Id) {
		const result = await this.articlesRepository.findOne(id);
		if (!result) throw new NotFoundError(ERROR.ARTICLE.NOT_FOUND);
		return ArticleMapper.toArticle(result);
	}

	async create(createArticle: CreateArticle, user: JwtUser) {
		const authorId = createArticle.authorId === undefined ? user.userId : createArticle.authorId;
		try {
			const result = await this.articlesRepository.create({ ...createArticle, authorId });
			if (!result) throw new InternalServerError(ERROR.ARTICLE.CREATE_FAILED);
			return ArticleMapper.toArticle(result);
		} catch (error) {
			if (pgError(error).isForeignKeyViolation) {
				throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
			}
			throw error;
		}
	}

	async update(id: Id, updateArticle: UpdateArticle, user: JwtUser) {
		const article = await this.findOne(id);

		if (user.role !== USER_ROLES.ADMIN && article.authorId !== user.userId) {
			throw new ForbiddenError(ERROR.ACCESS.ROLE);
		}

		if (updateArticle.status && updateArticle.status !== article.status) {
			const allowed = ARTICLE_STATUS_TRANSITIONS[article.status] || [];
			if (!allowed.includes(updateArticle.status)) {
				throw new BadRequestError(
					`Invalid status transition from ${article.status} to ${updateArticle.status}`,
				);
			}
		}

		const result = await this.articlesRepository.update(id, updateArticle);
		if (!result) throw new NotFoundError(ERROR.ARTICLE.NOT_FOUND);
		return ArticleMapper.toArticle(result);
	}

	async remove(id: Id, user: JwtUser) {
		const article = await this.findOne(id);

		if (user.role !== USER_ROLES.ADMIN && article.authorId !== user.userId) {
			throw new ForbiddenError(ERROR.ACCESS.ROLE);
		}

		const result = await this.articlesRepository.remove(id);
		if (!result) throw new NotFoundError(ERROR.ARTICLE.NOT_FOUND);
		return ArticleMapper.toArticle(result);
	}
}
