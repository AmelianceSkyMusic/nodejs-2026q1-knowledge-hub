import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Id } from 'src/common/types/id';

import { CommentEntity } from '../entities/comment.entity';

@Injectable()
export class CommentsRepository extends BaseRepository<CommentEntity> {
	removeByArticleId(articleId: Id) {
		this.data = this.data.filter((comment) => comment.articleId !== articleId);
	}

	removeByAuthorId(authorId: Id) {
		this.data = this.data.filter((comment) => comment.authorId !== authorId);
	}
}
