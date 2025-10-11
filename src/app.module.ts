import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ProblemsModule } from './problems/problems.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ChaptersModule } from './chapters/chapters.module';
import { TestSetsModule } from './test-sets/test-sets.module';
import { GradesModule } from './grades/grades.module';

@Module({
  imports: [
    DrizzleModule,
    ProblemsModule,
    SubjectsModule,
    GradesModule,
    ChaptersModule,
    TestSetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
