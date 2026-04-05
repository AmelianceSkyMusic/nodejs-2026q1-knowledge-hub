import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ArticleStatus } from 'src/articles/types/article-status';
import { Id } from 'src/common/types/id';

import { ARTICLE_STATUS } from 'src/articles/constants/article-status';
import { SWAGGER } from 'src/common/constants/swagger';

export class GetArticlesQueryRequestDto {
	@ApiProperty({
		description: 'Filter by article status',
		enum: ARTICLE_STATUS,
		required: false,
	})
	@IsOptional()
	@IsEnum(ARTICLE_STATUS)
	status?: ArticleStatus;

	@ApiProperty({
		description: 'Filter by category ID',
		required: false,
		format: SWAGGER.FORMAT.ID,
	})
	@IsOptional()
	@IsUUID('4')
	categoryId?: Id;

	@ApiProperty({
		description: 'Filter by tag name (can be repeated for multiple tags)',
		required: false,
	})
	@Transform(({ value }) => {
		if (!value) return value;
		return Array.isArray(value) ? value : [value];
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tag?: string[];
}
