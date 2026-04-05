import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Id } from 'src/common/types/id';

import { SWAGGER } from 'src/common/constants/swagger';

@Exclude()
export class CategoryResponseDto {
	@ApiProperty({
		example: SWAGGER.EXAMPLE.ID,
	})
	@Expose()
	id: Id;

	@ApiProperty({
		example: 'Technology',
	})
	@Expose()
	name: string;

	@ApiProperty({
		example: 'Articles about technology',
	})
	@Expose()
	description: string;
}
