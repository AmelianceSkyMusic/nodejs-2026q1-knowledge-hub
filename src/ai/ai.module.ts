import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ArticlesModule } from 'src/articles/articles.module';
import { AiThrottlerGuard } from 'src/common/guards/ai-throttler.guard';

import { AiCacheService } from './ai-cache.service';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiModule } from './gemini/gemini.module';
import { AiRepository } from './repositories/ai.repository';

@Module({
	imports: [ArticlesModule, GeminiModule, CacheModule.register()],
	controllers: [AiController],
	providers: [AiService, AiRepository, AiThrottlerGuard, AiCacheService],
})
export class AiModule {}
