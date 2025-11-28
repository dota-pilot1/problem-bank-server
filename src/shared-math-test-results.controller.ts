import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SharedMathTestResultsService } from './shared-math-test-results.service';
import {
  SubmitTestDto,
  TestResultResponse,
  RankingResponse,
} from './shared-test-results.dto';

@Controller('shared-math-test-results')
export class SharedMathTestResultsController {
  constructor(
    private readonly sharedMathTestResultsService: SharedMathTestResultsService,
  ) {}

  @Post('submit')
  async submitTest(@Body() dto: SubmitTestDto): Promise<TestResultResponse> {
    return this.sharedMathTestResultsService.submitTest(dto);
  }

  @Get(':testSetId/ranking')
  async getRanking(
    @Param('testSetId', ParseIntPipe) testSetId: number,
    @Query('userId') userId?: string,
    @Query('guestId') guestId?: string,
  ): Promise<RankingResponse> {
    return this.sharedMathTestResultsService.getRanking(
      testSetId,
      userId ? parseInt(userId) : undefined,
      guestId,
    );
  }

  @Delete(':testSetId/reset')
  async resetRanking(
    @Param('testSetId', ParseIntPipe) testSetId: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.sharedMathTestResultsService.resetRanking(testSetId);
  }

  @Get('user/submitted')
  async getSubmittedTestIds(
    @Query('userId') userId?: string,
    @Query('guestId') guestId?: string,
  ): Promise<number[]> {
    return this.sharedMathTestResultsService.getSubmittedTestIds(
      userId ? parseInt(userId) : undefined,
      guestId,
    );
  }

  @Get('report/summary')
  async getScoreReportSummary(@Query('userId') userId: string) {
    if (!userId) {
      throw new Error('userId is required');
    }
    return this.sharedMathTestResultsService.getScoreReportSummary(
      parseInt(userId),
    );
  }

  @Get('report/history')
  async getScoreReportHistory(@Query('userId') userId: string) {
    if (!userId) {
      throw new Error('userId is required');
    }
    return this.sharedMathTestResultsService.getScoreReportHistory(
      parseInt(userId),
    );
  }

  @Get('wrong-answers')
  async getWrongAnswers(@Query('userId') userId: string) {
    if (!userId) {
      throw new Error('userId is required');
    }
    return this.sharedMathTestResultsService.getWrongAnswers(parseInt(userId));
  }

  @Get('wrong-answers/:problemId')
  async getWrongAnswerDetail(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new Error('userId is required');
    }
    return this.sharedMathTestResultsService.getWrongAnswerDetail(
      parseInt(userId),
      problemId,
    );
  }

  @Get('results/:resultId/wrong-answers')
  async getWrongAnswersByResultId(
    @Param('resultId', ParseIntPipe) resultId: number,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new Error('userId is required');
    }
    return this.sharedMathTestResultsService.getWrongAnswersByResultId(
      parseInt(userId),
      resultId,
    );
  }

  @Get('results/:resultId/detail')
  async getTestResultDetail(
    @Param('resultId', ParseIntPipe) resultId: number,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new Error('userId is required');
    }
    return this.sharedMathTestResultsService.getTestResultDetail(
      parseInt(userId),
      resultId,
    );
  }
}
