import { Module } from '@nestjs/common';
import { GeminiModule } from 'src/ai/gemini/gemini.module';
import { ArticlesModule } from 'src/articles/articles.module';
import { CategoriesModule } from 'src/categories/categories.module';

import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { RagRepository } from './repositories/rag.repository';

@Module({
	imports: [ArticlesModule, CategoriesModule, GeminiModule],
	controllers: [RagController],
	providers: [RagService, RagRepository],
})
export class RagModule {}
