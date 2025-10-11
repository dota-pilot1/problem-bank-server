import { Module } from '@nestjs/common';
import { TestSetsService } from './test-sets.service';
import { TestSetsController } from './test-sets.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [TestSetsService],
  controllers: [TestSetsController],
})
export class TestSetsModule {}
