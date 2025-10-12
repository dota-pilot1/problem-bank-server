import { Module } from '@nestjs/common';
import { MathController } from './math.controller';
import { MathChaptersService } from './math-chapters.service';
import { MathProblemsService } from './math-problems.service';
import { MathTestSetsService } from './math-test-sets.service';
import { MathTestSessionsService } from './math-test-sessions.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [MathController],
  providers: [
    MathChaptersService,
    MathProblemsService,
    MathTestSetsService,
    MathTestSessionsService,
  ],
  exports: [
    MathChaptersService,
    MathProblemsService,
    MathTestSetsService,
    MathTestSessionsService,
  ],
})
export class MathModule {}
