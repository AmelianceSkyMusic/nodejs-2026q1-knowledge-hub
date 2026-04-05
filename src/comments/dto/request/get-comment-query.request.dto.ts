import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Id } from 'src/common/types/id';

import { SWAGGER } from 'src/common/constants/swagger';

export class GetCommentsQueryRequestDto {
	@ApiProperty({
		description: 'Article id',
		format: SWAGGER.FORMAT.ID,
	})
	@IsUUID()
	articleId: Id;
}
