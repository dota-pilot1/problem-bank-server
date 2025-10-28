import { IsString, IsOptional, IsInt, IsEnum, Min } from 'class-validator';

export enum TestType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  MIDTERM = 'MIDTERM',
  FINAL = 'FINAL',
  MOCK = 'MOCK',
}

export class CreateEnglishTestSetDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  gradeLevel: number;

  @IsEnum(TestType)
  testType: TestType;

  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimit?: number;
}
