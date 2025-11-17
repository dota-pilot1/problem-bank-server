import { IsString } from 'class-validator';

export class SummarizeVideoDto {
  @IsString()
  videoId: string;
}
