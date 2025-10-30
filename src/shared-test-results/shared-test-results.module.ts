import { Module } from '@nestjs/common';
import { SharedTestResultsService } from '../shared-test-results.service';
import { SharedTestResultsController } from '../shared-test-results.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [SharedTestResultsController],
  providers: [SharedTestResultsService],
})
export class SharedTestResultsModule {}
