import { createZodDto } from 'nestjs-zod';
import { IdParamSchema } from 'shared/common/schemas/id-param.schema';

export class IdParamDto extends createZodDto(IdParamSchema) {}
