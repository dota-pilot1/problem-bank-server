import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ProblemsModule } from './problems/problems.module';

@Module({
  imports: [DrizzleModule, ProblemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
