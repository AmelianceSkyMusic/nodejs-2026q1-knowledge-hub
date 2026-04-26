import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtUser } from 'shared/auth/schemas/jwt-user.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { ForbiddenError } from 'src/common/errors/forbidden.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { ValidationError } from 'src/common/errors/validation.error';
import { pgError } from 'src/common/utils/pg-error';

import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesWithPaginationQueryDto } from './dto/get-articles-with-pagination.query.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesRepository } from './repositories/articles.repository';

import { ARTICLE_STATUS_TRANSITIONS } from 'shared/articles/constants/article-status-transitions';
import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

@Injectable()
export class ArticlesService {
	constructor(private readonly articlesRepository: ArticlesRepository) {}

	async findAll(getArticlesWithPaginationQueryDto: GetArticlesWithPaginationQueryDto) {
		return await this.articlesRepository.findAll(getArticlesWithPaginationQueryDto);
	}

	async findOne(id: Id) {
		const result = await this.articlesRepository.findOne(id);
		if (!result) throw new NotFoundError(ERROR.ARTICLE.NOT_FOUND);
		return result;
	}

	async create(createArticleDto: CreateArticleDto, user: JwtUser) {
		const authorId =
			createArticleDto.authorId === undefined ? user.userId : createArticleDto.authorId;
		try {
			const result = await this.articlesRepository.create({ ...createArticleDto, authorId });
			if (!result) throw new InternalServerErrorException(ERROR.ARTICLE.CREATE_FAILED);
			return result;
		} catch (error) {
			if (pgError(error).isForeignKeyViolation) {
				throw new NotFoundError(ERROR.CATEGORY.NOT_FOUND);
			}
			throw error;
		}
	}

	async update(id: Id, updateArticleDto: UpdateArticleDto, user: JwtUser) {
		const article = await this.findOne(id);

		if (user.role !== USER_ROLES.ADMIN && article.authorId !== user.userId) {
			throw new ForbiddenError(ERROR.ACCESS.ROLE);
		}

		if (updateArticleDto.status && updateArticleDto.status !== article.status) {
			const allowed = ARTICLE_STATUS_TRANSITIONS[article.status] || [];
			if (!allowed.includes(updateArticleDto.status)) {
				throw new ValidationError(
					`Invalid status transition from ${article.status} to ${updateArticleDto.status}`,
				);
			}
		}

		const result = await this.articlesRepository.update(id, updateArticleDto);
		if (!result) throw new NotFoundError(ERROR.ARTICLE.NOT_FOUND);
		return result;
	}

	async remove(id: Id, user: JwtUser) {
		const article = await this.findOne(id);

		if (user.role !== USER_ROLES.ADMIN && article.authorId !== user.userId) {
			throw new ForbiddenError(ERROR.ACCESS.ROLE);
		}

		const result = await this.articlesRepository.remove(id);
		if (!result) throw new NotFoundError(ERROR.ARTICLE.NOT_FOUND);
		return result;
	}
}
