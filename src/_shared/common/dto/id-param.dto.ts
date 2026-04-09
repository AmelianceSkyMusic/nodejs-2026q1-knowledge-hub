import { createZodDto } from 'nestjs-zod';

import { IdParamSchema } from '../schemas/id-param.schema';

export class IdParamDto extends createZodDto(IdParamSchema) {}
