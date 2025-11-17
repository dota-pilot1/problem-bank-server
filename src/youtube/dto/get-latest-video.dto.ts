import { IsString } from 'class-validator';

export class GetLatestVideoDto {
  @IsString()
  channelId: string;
}
