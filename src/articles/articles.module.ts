import { forwardRef, Module } from '@nestjs/common';
import { CommentsModule } from 'src/comments/comments.module';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticlesRepository } from './repositories/articles.repository';

@Module({
	controllers: [ArticlesController],
	providers: [ArticlesService, ArticlesRepository],
	imports: [forwardRef(() => CommentsModule)],
	exports: [ArticlesService],
})
export class ArticlesModule {}
