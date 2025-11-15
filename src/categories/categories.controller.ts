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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * GET /categories
   * 모든 카테고리 조회 (플랫 리스트)
   */
  @Get()
  async findAll(
    @Query('subject') subject?: string,
    @Query('creatorType') creatorType?: string,
  ) {
    return this.categoriesService.findAll(subject, creatorType);
  }

  /**
   * GET /categories/tree
   * 트리 구조로 카테고리 조회
   */
  @Get('tree')
  async findTree(
    @Query('subject') subject?: string,
    @Query('creatorType') creatorType?: string,
  ) {
    return this.categoriesService.findTree(subject, creatorType);
  }

  /**
   * GET /categories/roots
   * 루트 카테고리만 조회
   */
  @Get('roots')
  async findRoots(@Query('subject') subject?: string) {
    return this.categoriesService.findRoots(subject);
  }

  /**
   * GET /categories/:id
   * 특정 카테고리 조회
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  /**
   * GET /categories/:id/children
   * 특정 카테고리의 자식 조회
   */
  @Get(':id/children')
  async findChildren(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findChildren(id);
  }

  /**
   * POST /categories
   * 카테고리 생성
   */
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /**
   * PUT /categories/:id
   * 카테고리 수정
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  /**
   * DELETE /categories/:id
   * 카테고리 삭제
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
