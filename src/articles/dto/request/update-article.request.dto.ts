import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateArticleRequestDto } from './create-article.request.dto';

export class UpdateArticleRequestDto extends PartialType(
	OmitType(CreateArticleRequestDto, ['authorId'] as const),
) {}
