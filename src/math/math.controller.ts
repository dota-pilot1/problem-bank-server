import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MathChaptersService } from './math-chapters.service';
import { MathProblemsService } from './math-problems.service';
import { MathTestSetsService } from './math-test-sets.service';
import { CreateMathChapterDto } from './dto/create-math-chapter.dto';
import { CreateMathProblemDto } from './dto/create-math-problem.dto';

@Controller('math')
export class MathController {
  constructor(
    private readonly chaptersService: MathChaptersService,
    private readonly problemsService: MathProblemsService,
    private readonly testSetsService: MathTestSetsService,
  ) {}

  // Chapters
  @Post('chapters')
  createChapter(@Body() dto: CreateMathChapterDto) {
    return this.chaptersService.create(dto);
  }

  @Get('chapters')
  findAllChapters(@Query('gradeLevel') gradeLevel?: string) {
    return this.chaptersService.findAll(gradeLevel ? +gradeLevel : undefined);
  }

  @Get('chapters/:id')
  findOneChapter(@Param('id') id: string) {
    return this.chaptersService.findOne(+id);
  }

  @Patch('chapters/:id')
  updateChapter(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMathChapterDto>,
  ) {
    return this.chaptersService.update(+id, dto);
  }

  @Delete('chapters/:id')
  removeChapter(@Param('id') id: string) {
    return this.chaptersService.remove(+id);
  }

  // Problems
  @Post('problems')
  createProblem(@Body() dto: CreateMathProblemDto) {
    return this.problemsService.create(dto);
  }

  @Get('problems')
  findAllProblems(@Query('chapterId') chapterId?: string) {
    return this.problemsService.findAll(chapterId ? +chapterId : undefined);
  }

  @Get('problems/:id')
  findOneProblem(@Param('id') id: string) {
    return this.problemsService.findOne(+id);
  }

  @Patch('problems/:id')
  updateProblem(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMathProblemDto>,
  ) {
    return this.problemsService.update(+id, dto);
  }

  @Delete('problems/:id')
  removeProblem(@Param('id') id: string) {
    return this.problemsService.remove(+id);
  }

  // Test Sets
  @Get('test-sets')
  findAllTestSets(@Query('gradeLevel') gradeLevel?: string) {
    return this.testSetsService.findAll(gradeLevel ? +gradeLevel : undefined);
  }

  @Get('test-sets/:id')
  findOneTestSet(@Param('id') id: string) {
    return this.testSetsService.findOne(+id);
  }

  @Get('test-sets/:id/problems')
  getTestSetProblems(@Param('id') id: string) {
    return this.testSetsService.getTestSetProblems(+id);
  }
}
