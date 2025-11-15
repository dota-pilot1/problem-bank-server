import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  exports: [QuestionsService],
})
export class QuestionsModule {}
