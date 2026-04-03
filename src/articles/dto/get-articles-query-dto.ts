import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Id } from 'src/common/types/id';

import { ARTICLE_STATUS } from '../constants/article-status';

import type { ArticleStatus } from '../types/article-status';

export class GetArticlesQueryDto {
	@IsOptional()
	@IsEnum(ARTICLE_STATUS)
	status?: ArticleStatus;

	@IsOptional()
	@IsUUID('4')
	categoryId?: Id;

	@IsOptional()
	@IsString()
	tag?: string;
}
