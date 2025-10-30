import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ProblemsModule } from './problems/problems.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ChaptersModule } from './chapters/chapters.module';
import { TestSetsModule } from './test-sets/test-sets.module';
import { GradesModule } from './grades/grades.module';
import { MathModule } from './math/math.module';
import { EnglishModule } from './english/english.module';
import { UploadModule } from './upload/upload.module';
import { ListeningScriptsModule } from './listening-scripts/listening-scripts.module';
import { ListeningQuestionsModule } from './listening-questions/listening-questions.module';
import { SharedTestResultsModule } from './shared-test-results/shared-test-results.module';
import { SharedTestResultsService } from './shared-test-results.service';
import { SharedTestResultsController } from './shared-test-results.controller';
import { ExamHallBookmarksModule } from './exam-hall-bookmarks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DrizzleModule,
    ProblemsModule,
    SubjectsModule,
    GradesModule,
    ChaptersModule,
    TestSetsModule,
    MathModule,
    EnglishModule,
    UploadModule,
    ListeningScriptsModule,
    ListeningQuestionsModule,
    SharedTestResultsModule,
    ExamHallBookmarksModule,
  ],
  controllers: [AppController, SharedTestResultsController],
  providers: [AppService, SharedTestResultsService],
})
export class AppModule {}
