import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { ArticleResponseDto } from './article.response.dto';

@Exclude()
export class ArticlesWithPaginationResponseDto {
	@Expose()
	@ApiProperty({ example: 10 })
	total: number;

	@Expose()
	@ApiProperty({ example: 1 })
	page: number;

	@Expose()
	@ApiProperty({ example: 10 })
	limit: number;

	@Expose()
	@ApiProperty({ type: [ArticleResponseDto] })
	data: ArticleResponseDto[];
}
