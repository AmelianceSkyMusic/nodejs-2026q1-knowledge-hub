import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Id } from 'src/common/types/id';

import { ArticleStatus } from '../types/article-status';

import { ARTICLE_STATUS } from '../constants/article-status';

export class CreateArticleDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	content: string;

	@IsOptional()
	@IsEnum(ARTICLE_STATUS)
	status?: ArticleStatus = ARTICLE_STATUS.DRAFT;

	@IsOptional()
	@IsUUID('4')
	authorId?: Id | null = null;

	@IsOptional()
	@IsUUID('4')
	categoryId?: Id | null = null;

	@IsOptional()
	@IsString({ each: true })
	@IsArray()
	tags?: string[] = [];
}
