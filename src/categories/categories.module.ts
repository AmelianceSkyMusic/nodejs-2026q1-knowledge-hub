import { Module } from '@nestjs/common';
import { ArticlesModule } from 'src/articles/articles.module';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './repositories/categories.repository';

@Module({
	controllers: [CategoriesController],
	providers: [CategoriesService, CategoriesRepository],
	imports: [ArticlesModule],
})
export class CategoriesModule {}
