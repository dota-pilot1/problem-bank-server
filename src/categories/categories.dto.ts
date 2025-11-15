import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
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

export class CreateCategoryDto {
  @IsInt()
  @IsOptional()
  parentId?: number;

  @IsString()
  name: string;

  @IsEnum(SubjectType)
  subject: SubjectType;

  @IsEnum(CreatorType)
  @IsOptional()
  creatorType?: CreatorType = CreatorType.SYSTEM;

  @IsNumber()
  @IsOptional()
  creatorId?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number = 0;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto {
  @IsInt()
  @IsOptional()
  parentId?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CategoryResponseDto {
  id: number;
  parentId: number | null;
  name: string;
  subject: string;
  creatorType: string;
  creatorId: number | null;
  orderIndex: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  children?: CategoryResponseDto[]; // 트리 구조용
}

export class CategoryTreeDto extends CategoryResponseDto {
  declare children: CategoryTreeDto[];
  questionCount?: number; // 하위 문제 개수
}
