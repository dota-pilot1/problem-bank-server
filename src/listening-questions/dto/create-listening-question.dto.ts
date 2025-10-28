import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ScriptMessageDto {
  @IsEnum(['USER', 'CHATBOT'])
  role: 'USER' | 'CHATBOT';

  @IsString()
  @IsNotEmpty()
  message: string;
}

class ScriptDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScriptMessageDto)
  messages: ScriptMessageDto[];
}

export class CreateListeningQuestionDto {
  @IsString()
  @IsNotEmpty()
  subject: string; // "영어", "수학", "과학"

  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsEnum(['text', 'script'])
  listeningType: 'text' | 'script';

  @IsString()
  @IsOptional()
  listeningText?: string; // listeningType이 'text'일 때 필수

  @IsOptional()
  @ValidateNested()
  @Type(() => ScriptDto)
  script?: ScriptDto; // listeningType이 'script'일 때 필수

  @IsArray()
  @IsString({ each: true })
  choices: string[]; // ["A", "B", "C", "D"]

  @IsString()
  @IsNotEmpty()
  correctAnswer: string; // "A", "B", "C", "D"

  @IsEnum([1, 2, 3, 4, 5])
  difficulty: 1 | 2 | 3 | 4 | 5;
}
