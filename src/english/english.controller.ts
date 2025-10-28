import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { EnglishChaptersService } from './english-chapters.service';
import { EnglishProblemsService } from './english-problems.service';
import { EnglishTestSetsService } from './english-test-sets.service';
import { EnglishTestSessionsService } from './english-test-sessions.service';
import { CreateEnglishChapterDto } from './dto/create-english-chapter.dto';
import { CreateEnglishProblemDto } from './dto/create-english-problem.dto';
import { CreateEnglishTestSetDto } from './dto/create-english-test-set.dto';

@Controller('english')
export class EnglishController {
  constructor(
    private readonly chaptersService: EnglishChaptersService,
    private readonly problemsService: EnglishProblemsService,
    private readonly testSetsService: EnglishTestSetsService,
    private readonly testSessionsService: EnglishTestSessionsService,
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
  findAllProblems(
    @Query('chapterId') chapterId?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.problemsService.findAll(
      chapterId ? +chapterId : undefined,
      difficulty,
    );
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

  // Test Sets
  @Post('test-sets')
  createTestSet(@Body() dto: CreateEnglishTestSetDto) {
    return this.testSetsService.create({
      ...dto,
      totalQuestions: 0,
    });
  }

  @Get('test-sets')
  findAllTestSets(@Query('gradeLevel') gradeLevel?: string) {
    return this.testSetsService.findAll(gradeLevel ? +gradeLevel : undefined);
  }

  @Get('test-sets/:id')
  findOneTestSet(@Param('id') id: string) {
    return this.testSetsService.findOne(+id);
  }

  @Patch('test-sets/:id')
  updateTestSet(
    @Param('id') id: string,
    @Body() dto: Partial<CreateEnglishTestSetDto>,
  ) {
    return this.testSetsService.update(+id, dto);
  }

  @Delete('test-sets/:id')
  removeTestSet(@Param('id') id: string) {
    return this.testSetsService.remove(+id);
  }

  @Get('test-sets/:id/problems')
  getTestSetProblems(@Param('id') id: string) {
    return this.testSetsService.getTestSetProblems(+id);
  }

  @Post('test-sets/:testSetId/problems')
  addProblemToTestSet(
    @Param('testSetId') testSetId: string,
    @Body() body: { problemId: number; score?: number },
  ) {
    return this.testSetsService.addProblemToTestSet(
      +testSetId,
      body.problemId,
      body.score || 1,
    );
  }

  @Delete('test-sets/:testSetId/problems/:problemId')
  removeProblemFromTestSet(
    @Param('testSetId') testSetId: string,
    @Param('problemId') problemId: string,
  ) {
    return this.testSetsService.removeProblemFromTestSet(
      +testSetId,
      +problemId,
    );
  }

  // Test Sessions (시험장)
  @Post('test-sessions/start')
  startTest(@Request() req, @Body() body: { testSetId: number }) {
    const userId = req.user?.id || 1; // TODO: 실제 인증 구현
    return this.testSessionsService.startTest(userId, body.testSetId);
  }

  @Get('test-sessions/:sessionId')
  getSession(@Param('sessionId') sessionId: string) {
    return this.testSessionsService.getSession(+sessionId);
  }

  @Get('test-sessions/:sessionId/current-question')
  getCurrentQuestion(@Param('sessionId') sessionId: string) {
    return this.testSessionsService.getCurrentQuestion(+sessionId);
  }

  @Post('test-sessions/:sessionId/answer')
  submitAnswer(
    @Param('sessionId') sessionId: string,
    @Body()
    body: {
      problemId: number;
      userAnswer: string;
      responseTimeSeconds?: number;
    },
  ) {
    return this.testSessionsService.submitAnswer(
      +sessionId,
      body.problemId,
      body.userAnswer,
      body.responseTimeSeconds,
    );
  }

  @Get('test-sessions/:sessionId/result')
  getResult(@Param('sessionId') sessionId: string) {
    return this.testSessionsService.getResult(+sessionId);
  }

  @Get('test-sessions/user/:userId/history')
  getUserTestHistory(
    @Param('userId') userId: string,
    @Query('testSetId') testSetId?: string,
  ) {
    return this.testSessionsService.getUserTestHistory(
      +userId,
      testSetId ? +testSetId : undefined,
    );
  }
}
