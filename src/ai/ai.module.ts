import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ArticlesModule } from 'src/articles/articles.module';
import { AiThrottlerGuard } from 'src/common/guards/ai-throttler.guard';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiService } from './gemini.service';
import { AiRepository } from './repositories/ai.repository';

@Module({
	imports: [HttpModule, ArticlesModule],
	controllers: [AiController],
	providers: [AiService, GeminiService, AiRepository, AiThrottlerGuard],
})
export class AiModule {}
