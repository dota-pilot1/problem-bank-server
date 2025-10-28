import { Module } from '@nestjs/common';
import { ListeningScriptsController } from './listening-scripts.controller';
import { ListeningScriptsService } from './listening-scripts.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { OpenAIGeneratorService } from './services/openai-generator.service';
import { GoogleNewsSearchService } from './services/google-news-search.service';
import { DailyNewsIssueService } from './services/daily-news-issue.service';

@Module({
  imports: [DrizzleModule],
  controllers: [ListeningScriptsController],
  providers: [
    ListeningScriptsService,
    OpenAIGeneratorService,
    GoogleNewsSearchService,
    DailyNewsIssueService,
  ],
  exports: [ListeningScriptsService],
})
export class ListeningScriptsModule {}
