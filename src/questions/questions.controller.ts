import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto, UpdateQuestionDto } from './questions.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  /**
   * GET /questions
   * 모든 문제 조회
   */
  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('creatorType') creatorType?: string,
  ) {
    return this.questionsService.findAll(
      categoryId ? parseInt(categoryId) : undefined,
      creatorType,
    );
  }

  /**
   * GET /questions/:id
   * 특정 문제 조회
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  /**
   * GET /questions/category/:categoryId
   * 특정 카테고리의 문제 목록
   */
  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.questionsService.findByCategory(categoryId);
  }

  /**
   * GET /questions/creator/:creatorId
   * 특정 사용자의 문제 목록
   */
  @Get('creator/:creatorId')
  async findByCreator(@Param('creatorId', ParseIntPipe) creatorId: number) {
    return this.questionsService.findByCreator(creatorId);
  }

  /**
   * POST /questions
   * 문제 생성
   */
  @Post()
  async create(@Body() dto: CreateQuestionDto) {
    return this.questionsService.create(dto);
  }

  /**
   * PUT /questions/:id
   * 문제 수정
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, dto);
  }

  /**
   * PATCH /questions/:id/move
   * 문제 이동 (카테고리 변경)
   */
  @Patch(':id/move')
  async moveToCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.questionsService.moveToCategory(id, categoryId);
  }

  /**
   * DELETE /questions/:id
   * 문제 삭제
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.remove(id);
  }
}
