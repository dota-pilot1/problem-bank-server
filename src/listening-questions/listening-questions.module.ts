import { Module } from '@nestjs/common';
import { ListeningQuestionsController } from './listening-questions.controller';
import { ListeningQuestionsService } from './listening-questions.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [ListeningQuestionsController],
  providers: [ListeningQuestionsService],
})
export class ListeningQuestionsModule {}
