import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ZodSerializerInterceptor } from 'nestjs-zod';

import { AiModule } from './ai/ai.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { AppLoggerModule } from './common/app-logger/app-logger.module';
import configuration from './common/config/configuration';
import { AllExceptionsFilter } from './common/exception-filters/all-exceptions.filter';
import { ZodExceptionFilter } from './common/exception-filters/zod-exception.filter';
import { AuthGuard } from './common/guards/auth.guard';
import { GlobalThrottlerGuard } from './common/guards/global-throttler.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CustomZodValidationPipe } from './common/pipes/custom-zod-validation.pipe';
import { DrizzleModule } from './drizzle/drizzle.module';
import { HealthModule } from './health/health.module';
import { QdrantModule } from './qdrant/qdrant.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
		AppLoggerModule,
		ThrottlerModule.forRoot({
			throttlers: [
				{
					name: 'short',
					ttl: 1000,
					limit: 3,
				},
				{
					name: 'medium',
					ttl: 10000,
					limit: 20,
				},
				{
					name: 'long',
					ttl: 60000,
					limit: 100,
				},
				{
					name: 'dedicated-ai',
					ttl: 60000,
					limit: 20,
				},
			],
			skipIf: (context) => {
				const req = context.switchToHttp().getRequest();
				return req.headers['x-test-mode'] === 'true';
			},
		}),
		ArticlesModule,
		CategoriesModule,
		UsersModule,
		CommentsModule,
		HealthModule,
		DrizzleModule,
		AuthModule,
		TokensModule,
		AiModule,
		QdrantModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: GlobalThrottlerGuard,
		},
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
			useClass: AllExceptionsFilter,
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
