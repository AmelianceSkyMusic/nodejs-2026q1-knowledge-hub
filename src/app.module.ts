import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import configuration from './common/config/configuration';
import { LoggerMiddleware } from './common/middleware/logger-middleware..middleware';
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
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
