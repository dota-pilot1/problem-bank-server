import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';

@Module({
  imports: [ConfigModule],
  providers: [YoutubeService],
  controllers: [YoutubeController],
})
export class YoutubeModule {}
