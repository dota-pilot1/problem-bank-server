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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
