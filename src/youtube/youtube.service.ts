import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { YoutubeTranscript } from 'youtube-transcript';
import axios from 'axios';
import { VideoInfoDto } from './dto/video-info.dto';
import { VideoSummaryDto } from './dto/video-summary.dto';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not found in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }

  async getLatestVideo(channelId: string): Promise<VideoInfoDto> {
    try {
      this.logger.log(`Fetching latest video for channel: ${channelId}`);

      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const response = await axios.get(rssUrl);
      const xmlData = response.data;

      const videoIdMatch = xmlData.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = xmlData.match(/<title>(.*?)<\/title>/g);
      const publishedMatch = xmlData.match(/<published>(.*?)<\/published>/);
      const channelNameMatch = xmlData.match(/<name>(.*?)<\/name>/);

      if (!videoIdMatch || !titleMatch || titleMatch.length < 2) {
        throw new BadRequestException('Failed to parse YouTube RSS feed');
      }

      const videoId = videoIdMatch[1];
      const title = titleMatch[1].replace(/<title>|<\/title>/g, '');
      const publishedAt = publishedMatch
        ? publishedMatch[1]
        : new Date().toISOString();
      const channelName = channelNameMatch ? channelNameMatch[1] : 'Unknown';
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

      this.logger.log(`Found latest video: ${videoId} - ${title}`);

      return {
        videoId,
        title,
        publishedAt,
        thumbnailUrl,
        channelName,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching latest video: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        'Failed to fetch latest video from YouTube',
      );
    }
  }

  async summarizeVideo(videoId: string): Promise<VideoSummaryDto> {
    try {
      this.logger.log(`Summarizing video: ${videoId}`);

      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);

      if (!transcriptData || transcriptData.length === 0) {
        throw new BadRequestException('No transcript available for this video');
      }

      const fullTranscript = transcriptData.map((item) => item.text).join(' ');

      this.logger.log(`Transcript length: ${fullTranscript.length} characters`);

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt = `다음은 유튜브 뉴스 영상의 자막입니다. 영어 듣기 문제 제작을 위해 요약해주세요.

**자막**:
${fullTranscript.substring(0, 10000)}

**요약 형식** (JSON만 출력, 다른 텍스트 없이):
{
  "title": "영상 제목 (한국어)",
  "mainContent": "주요 내용을 2-3문장으로 요약 (한국어)",
  "keyDiscussions": [
    "주요 대화/논쟁/인용구 1 (영어 원문)",
    "주요 대화/논쟁/인용구 2 (영어 원문)",
    "주요 대화/논쟁/인용구 3 (영어 원문)",
    "주요 대화/논쟁/인용구 4 (영어 원문)",
    "주요 대화/논쟁/인용구 5 (영어 원문)"
  ]
}

주의사항:
- keyDiscussions는 실제 영상에서 언급된 영어 원문 그대로 추출
- 뉴스 앵커, 인터뷰이의 직접 발언 우선
- 각 발언은 1-2문장 길이
- JSON 형식만 출력하고 마크다운 코드 블록은 사용하지 마세요
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      this.logger.log(`Gemini response: ${responseText.substring(0, 200)}...`);

      let cleanedResponse = responseText.trim();
      const jsonCodeBlock = '```json';
      const codeBlock = '```';
      if (cleanedResponse.startsWith(jsonCodeBlock)) {
        cleanedResponse = cleanedResponse
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '');
      } else if (cleanedResponse.startsWith(codeBlock)) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
      }

      const summary: VideoSummaryDto = JSON.parse(cleanedResponse);

      if (!summary.keyDiscussions || summary.keyDiscussions.length < 5) {
        this.logger.warn('Summary has less than 5 key discussions');
      }

      return summary;
    } catch (error) {
      this.logger.error(
        `Error summarizing video: ${error.message}`,
        error.stack,
      );

      if (error instanceof SyntaxError) {
        throw new BadRequestException(
          'Failed to parse Gemini response as JSON',
        );
      }

      throw new BadRequestException('Failed to summarize video');
    }
  }
}
