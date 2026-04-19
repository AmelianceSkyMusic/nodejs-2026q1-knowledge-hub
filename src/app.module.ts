import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor } from 'nestjs-zod';

import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import configuration from './common/config/configuration';
import { ZodExceptionFilter } from './common/exception-filters/zod-exception-filter';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { LoggerMiddleware } from './common/middleware/logger-middleware.middleware';
import { CustomZodValidationPipe } from './common/pipes/custom-zod-validation.pipe';
import { DrizzleModule } from './drizzle/drizzle.module';
import { HealthModule } from './health/health.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
		ArticlesModule,
		CategoriesModule,
		UsersModule,
		CommentsModule,
		HealthModule,
		DrizzleModule,
		AuthModule,
		TokensModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: CustomZodValidationPipe,
		},
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: ZodExceptionFilter,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
