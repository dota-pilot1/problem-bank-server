import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsNumber,
  Min,
} from 'class-validator';

export enum SubjectType {
  ENGLISH = 'ENGLISH',
  MATH = 'MATH',
}

export enum CreatorType {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
}

export type RoleType = 'LEFT_CHARACTER' | 'RIGHT_CHARACTER' | 'NARRATION';

export interface ChatMessage {
  role: RoleType;
  message: string;
}

export interface ScriptData {
  title?: string;
  situation?: string;
  roles?: string[];
  messages: ChatMessage[];
}

export class CreateChatScriptDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  scriptData: ScriptData;

  @IsEnum(SubjectType)
  subject: SubjectType;

  @IsEnum(CreatorType)
  @IsOptional()
  creatorType?: CreatorType = CreatorType.SYSTEM;

  @IsNumber()
  @IsOptional()
  creatorId?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  displayOrder?: number = 0;
}

export class UpdateChatScriptDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  scriptData?: ScriptData;

  @IsNumber()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  viewCount?: number;
}

export class ChatScriptResponseDto {
  id: number;
  title: string;
  description: string | null;
  scriptData: ScriptData;
  subject: string;
  creatorType: string;
  creatorId: number | null;
  displayOrder: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
