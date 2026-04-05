import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ArticleStatus } from 'src/articles/types/article-status';
import { Id } from 'src/common/types/id';

import { ARTICLE_STATUS } from 'src/articles/constants/article-status';
import { SWAGGER } from 'src/common/constants/swagger';

export class CreateArticleRequestDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	content: string;

	@ApiProperty({
		default: ARTICLE_STATUS.DRAFT,
		enum: ARTICLE_STATUS,
	})
	@IsOptional()
	@IsEnum(ARTICLE_STATUS)
	status?: ArticleStatus = ARTICLE_STATUS.DRAFT;

	@ApiProperty({
		required: false,
		format: SWAGGER.FORMAT.ID,
	})
	@IsOptional()
	@IsUUID('4')
	authorId?: Id | null = null;

	@ApiProperty({
		required: false,
		format: SWAGGER.FORMAT.ID,
	})
	@IsOptional()
	@IsUUID('4')
	categoryId?: Id | null = null;

	@ApiProperty()
	@IsOptional()
	@IsString({ each: true })
	@IsArray()
	tags?: string[] = [];
}
