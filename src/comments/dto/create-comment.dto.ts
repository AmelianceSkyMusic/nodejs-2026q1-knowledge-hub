import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Id } from 'src/common/types/id';

export class CreateCommentDto {
	@IsNotEmpty()
	@IsString()
	content: string;

	@IsNotEmpty()
	@IsUUID('4')
	articleId: Id;

	@IsOptional()
	@IsUUID('4')
	authorId?: Id | null = null;
}
