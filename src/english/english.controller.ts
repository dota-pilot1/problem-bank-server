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
import { EnglishChaptersService } from './english-chapters.service';
import { EnglishProblemsService } from './english-problems.service';
import { CreateEnglishChapterDto } from './dto/create-english-chapter.dto';
import { CreateEnglishProblemDto } from './dto/create-english-problem.dto';

@Controller('english')
export class EnglishController {
  constructor(
    private readonly chaptersService: EnglishChaptersService,
    private readonly problemsService: EnglishProblemsService,
  ) {}

  // Chapters
  @Post('chapters')
  createChapter(@Body() dto: CreateEnglishChapterDto) {
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
    @Body() dto: Partial<CreateEnglishChapterDto>,
  ) {
    return this.chaptersService.update(+id, dto);
  }

  @Delete('chapters/:id')
  removeChapter(@Param('id') id: string) {
    return this.chaptersService.remove(+id);
  }

  // Problems
  @Post('problems')
  createProblem(@Body() dto: CreateEnglishProblemDto) {
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
    @Body() dto: Partial<CreateEnglishProblemDto>,
  ) {
    return this.problemsService.update(+id, dto);
  }

  @Delete('problems/:id')
  removeProblem(@Param('id') id: string) {
    return this.problemsService.remove(+id);
  }
}
