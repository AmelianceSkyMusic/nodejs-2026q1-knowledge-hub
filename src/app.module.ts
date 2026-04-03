import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import configuration from './common/config/configuration';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({ load: [configuration] }),
		ArticlesModule,
		CategoriesModule,
		UsersModule,
		CommentsModule,
	],
})
export class AppModule {}
