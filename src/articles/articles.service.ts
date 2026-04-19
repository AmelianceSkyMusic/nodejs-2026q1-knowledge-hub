import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateArticle } from 'shared/articles/schemas/create-article.schema';
import { GetArticlesWithPaginationQuery } from 'shared/articles/schemas/get-articles-with-pagination.query.schema';
import { UpdateArticle } from 'shared/articles/schemas/update-article.schema';
import { JwtUser } from 'shared/auth/schemas/jwt-user.schema';
import { Id } from 'shared/common/schemas/id.schema';
import { pgError } from 'src/common/utils/pg-error';

import { ArticlesRepository } from './repositories/articles.repository';

import { ERROR } from 'shared/common/constants/error';
import { USER_ROLES } from 'shared/users/constants/user-role';

@Injectable()
export class ArticlesService {
	constructor(private readonly articlesRepository: ArticlesRepository) {}

	async findAll(getArticlesWithPaginationQuery: GetArticlesWithPaginationQuery) {
		return await this.articlesRepository.findAll(getArticlesWithPaginationQuery);
	}

	async findOne(id: Id) {
		const result = await this.articlesRepository.findOne(id);
		if (!result) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);
		return result;
	}

	async create(createArticle: CreateArticle, user: JwtUser) {
		const authorId = user.userId;
		try {
			const result = await this.articlesRepository.create({ ...createArticle, authorId });
			if (!result) throw new InternalServerErrorException(ERROR.ARTICLE.CREATE_FAILED);
			return result;
		} catch (error) {
			if (pgError(error).isForeignKeyViolation) {
				throw new NotFoundException(ERROR.CATEGORY.NOT_FOUND);
			}
			throw error;
		}
	}

	async update(id: Id, updateArticle: UpdateArticle, user: JwtUser) {
		const article = await this.findOne(id);

		if (user.role !== USER_ROLES.ADMIN && article.authorId !== user.userId) {
			throw new ForbiddenException(ERROR.ACCESS.ROLE);
		}

		const result = await this.articlesRepository.update(id, updateArticle);
		if (!result) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);
		return result;
	}

	async remove(id: Id) {
		const result = await this.articlesRepository.remove(id);
		if (!result) throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);
		return result;
	}
}
