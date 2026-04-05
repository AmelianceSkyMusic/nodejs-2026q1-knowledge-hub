import { forwardRef, Module } from '@nestjs/common';
import { ArticlesModule } from 'src/articles/articles.module';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
	controllers: [CommentsController],
	providers: [CommentsService, CommentsRepository],
	imports: [forwardRef(() => ArticlesModule)],
	exports: [CommentsService],
})
export class CommentsModule {}
