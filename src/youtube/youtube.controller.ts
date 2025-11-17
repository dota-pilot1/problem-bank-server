import { Controller, Post, Body, Logger } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { GetLatestVideoDto } from './dto/get-latest-video.dto';
import { SummarizeVideoDto } from './dto/summarize-video.dto';
import { VideoInfoDto } from './dto/video-info.dto';
import { VideoSummaryDto } from './dto/video-summary.dto';

@Controller('youtube')
export class YoutubeController {
  private readonly logger = new Logger(YoutubeController.name);

  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('latest-video')
  async getLatestVideo(@Body() dto: GetLatestVideoDto): Promise<VideoInfoDto> {
    this.logger.log(`GET /youtube/latest-video - channelId: ${dto.channelId}`);
    return this.youtubeService.getLatestVideo(dto.channelId);
  }

  @Post('summarize')
  async summarizeVideo(
    @Body() dto: SummarizeVideoDto,
  ): Promise<VideoSummaryDto> {
    this.logger.log(`POST /youtube/summarize - videoId: ${dto.videoId}`);
    return this.youtubeService.summarizeVideo(dto.videoId);
  }
}
