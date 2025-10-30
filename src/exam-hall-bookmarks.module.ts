import { Module } from '@nestjs/common';
import { ExamHallBookmarksController } from './exam-hall-bookmarks.controller';
import { ExamHallBookmarksService } from './exam-hall-bookmarks.service';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [ExamHallBookmarksController],
  providers: [ExamHallBookmarksService],
})
export class ExamHallBookmarksModule {}
