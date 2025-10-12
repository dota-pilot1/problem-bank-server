import { Module } from '@nestjs/common';
import { EnglishController } from './english.controller';
import { EnglishChaptersService } from './english-chapters.service';
import { EnglishProblemsService } from './english-problems.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [EnglishController],
  providers: [EnglishChaptersService, EnglishProblemsService],
  exports: [EnglishChaptersService, EnglishProblemsService],
})
export class EnglishModule {}
