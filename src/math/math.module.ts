import { Module } from '@nestjs/common';
import { MathController } from './math.controller';
import { MathChaptersService } from './math-chapters.service';
import { MathProblemsService } from './math-problems.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [MathController],
  providers: [MathChaptersService, MathProblemsService],
  exports: [MathChaptersService, MathProblemsService],
})
export class MathModule {}
