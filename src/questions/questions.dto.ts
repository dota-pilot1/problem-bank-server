import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
  Min,
} from 'class-validator';

export enum CreatorType {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
}

export enum Difficulty {
  LEVEL_1 = 'LEVEL_1',
  LEVEL_2 = 'LEVEL_2',
  LEVEL_3 = 'LEVEL_3',
  LEVEL_4 = 'LEVEL_4',
  LEVEL_5 = 'LEVEL_5',
}

export class CreateQuestionDto {
  @IsInt()
  categoryId: number;

  @IsEnum(CreatorType)
  @IsOptional()
  creatorType?: CreatorType = CreatorType.SYSTEM;

  @IsNumber()
  @IsOptional()
  creatorId?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  passage?: string; // 독해 지문

  @IsObject()
  @IsOptional()
  scriptData?: {
    characters: Array<{
      role: string;
      avatar: string;
      gender: 'male' | 'female';
    }>;
    dialogues: Array<{
      speaker: string;
      text: string;
    }>;
  }; // 채팅 스크립트 JSON

  @IsString()
  questionText: string;

  @IsArray()
  @IsOptional()
  options?: string[]; // ["A", "B", "C", "D"]

  @IsString()
  correctAnswer: string;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  audioText?: string; // 듣기 문제용

  @IsString()
  @IsOptional()
  formula?: string; // 수학 수식

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number = 0;
}

export class UpdateQuestionDto {
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  passage?: string;

  @IsObject()
  @IsOptional()
  scriptData?: {
    characters: Array<{
      role: string;
      avatar: string;
      gender: 'male' | 'female';
    }>;
    dialogues: Array<{
      speaker: string;
      text: string;
    }>;
  };

  @IsString()
  @IsOptional()
  questionText?: string;

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  audioText?: string;

  @IsString()
  @IsOptional()
  formula?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;
}

export class QuestionResponseDto {
  id: number;
  categoryId: number;
  creatorType: string;
  creatorId: number | null;
  title: string | null;
  passage: string | null;
  scriptData: {
    characters: Array<{
      role: string;
      avatar: string;
      gender: 'male' | 'female';
    }>;
    dialogues: Array<{
      speaker: string;
      text: string;
    }>;
  } | null;
  questionText: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string | null;
  difficulty: string | null;
  tags: string | null;
  audioText: string | null;
  formula: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}
