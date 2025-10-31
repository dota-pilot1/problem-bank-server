import { Module } from '@nestjs/common';
import { ListeningScriptsController } from './listening-scripts.controller';
import { ListeningScriptsService } from './listening-scripts.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { OpenAIGeneratorService } from './services/openai-generator.service';

@Module({
  imports: [DrizzleModule],
  controllers: [ListeningScriptsController],
  providers: [ListeningScriptsService, OpenAIGeneratorService],
  exports: [ListeningScriptsService],
})
export class ListeningScriptsModule {}
