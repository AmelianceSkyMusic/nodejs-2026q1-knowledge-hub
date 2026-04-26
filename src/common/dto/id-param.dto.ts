import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { IdParamSchema } from 'shared/common/schemas/id-param.schema';

import { SWAGGER } from '../constants/swagger';

export class IdParamDto extends createZodDto(IdParamSchema) {
	@ApiProperty({
		description: 'The unique identifier (UUID) of the resource',
		example: SWAGGER.EXAMPLE.ID,
	})
	id: string;
}
