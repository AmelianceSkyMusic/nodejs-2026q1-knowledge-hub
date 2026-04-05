import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Id } from 'src/common/types/id';

import { ArticleEntity } from '../entities/article.entity';

@Injectable()
export class ArticlesRepository extends BaseRepository<ArticleEntity> {
	nullifyCategory(categoryId: Id) {
		this.data = this.data.map((article) => ({
			...article,
			categoryId: article.categoryId === categoryId ? null : article.categoryId,
		}));
	}

	nullifyAuthor(authorId: Id) {
		this.data = this.data.map((article) => ({
			...article,
			authorId: article.authorId === authorId ? null : article.authorId,
		}));
	}
}
