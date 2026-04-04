import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ArticleStatus } from 'src/articles/types/article-status';
import { Id } from 'src/common/types/id';

import { SWAGGER } from 'src/common/constants/swagger';

@Exclude()
export class ArticleResponseDto {
	@Expose()
	@ApiProperty({ example: SWAGGER.EXAMPLE.ID })
	id: Id;

	@Expose()
	@ApiProperty({ example: 'Introduction to NestJS' })
	title: string;

	@Expose()
	@ApiProperty({
		example: 'NestJS is a framework for building efficient server-side applications.',
	})
	content: string;

	@Expose()
	@ApiProperty({ example: 'draft' })
	status: ArticleStatus;

	@Expose()
	@ApiProperty({ example: SWAGGER.EXAMPLE.ID })
	authorId: Id | null;

	@Expose()
	@ApiProperty({ example: SWAGGER.EXAMPLE.ID })
	categoryId: Id | null;

	@Expose()
	@ApiProperty({ example: ['nodejs', 'typescript'] })
	tags: string[];

	@Expose()
	@ApiProperty({ example: SWAGGER.EXAMPLE.TIMESTAMP })
	createdAt: number;

	@Expose()
	@ApiProperty({ example: SWAGGER.EXAMPLE.TIMESTAMP })
	updatedAt: number;
}
