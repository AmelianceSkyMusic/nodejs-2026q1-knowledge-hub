import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { CreateArticle } from 'src/_shared/articles/schemas/create-article.schema';
import { GetArticlesWithPaginationQuery } from 'src/_shared/articles/schemas/get-articles-with-pagination.query.schema';
import { UpdateArticle } from 'src/_shared/articles/schemas/update-article.schema';
import { Id } from 'src/_shared/common/schemas/id.schema';

import { ArticlesRepository } from './repositories/articles.repository';

import { ERROR } from 'src/_shared/common/constants/error';

@Injectable()
export class ArticlesService {
	constructor(private readonly articlesRepository: ArticlesRepository) {}

	async findAll(getArticlesWithPaginationQuery: GetArticlesWithPaginationQuery) {
		return await this.articlesRepository.findAll(getArticlesWithPaginationQuery);
	}

	async findOne(id: Id) {
		return await this.articlesRepository.findOne(id);
	}

	async create(createArticle: CreateArticle) {
		try {
			return await this.articlesRepository.create(createArticle);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') throw new ConflictException(ERROR.ARTICLE.ALREADY_EXISTS);
			}
			throw error;
		}
	}

	async update(id: Id, updateArticle: UpdateArticle) {
		try {
			return await this.articlesRepository.update(id, updateArticle);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);
			}
			throw error;
		}
	}

	async remove(id: Id) {
		try {
			return await this.articlesRepository.remove(id);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException(ERROR.ARTICLE.NOT_FOUND);
			}
			throw error;
		}
	}
}
