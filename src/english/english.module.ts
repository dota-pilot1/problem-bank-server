import { Module } from '@nestjs/common';
import { EnglishController } from './english.controller';
import { EnglishChaptersService } from './english-chapters.service';
import { EnglishProblemsService } from './english-problems.service';
import { EnglishTestSetsService } from './english-test-sets.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [EnglishController],
  providers: [
    EnglishChaptersService,
    EnglishProblemsService,
    EnglishTestSetsService,
  ],
  exports: [
    EnglishChaptersService,
    EnglishProblemsService,
    EnglishTestSetsService,
  ],
})
export class EnglishModule {}
