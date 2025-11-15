import { Module } from '@nestjs/common';
import { ChatScriptsService } from './chat-scripts.service';
import { ChatScriptsController } from './chat-scripts.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [ChatScriptsService],
  controllers: [ChatScriptsController],
  exports: [ChatScriptsService],
})
export class ChatScriptsModule {}
