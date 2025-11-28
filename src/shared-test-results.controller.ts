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
import { SharedTestResultsService } from './shared-test-results.service';
import {
  SubmitTestDto,
  TestResultResponse,
  RankingResponse,
} from './shared-test-results.dto';

@Controller('shared-test-results')
export class SharedTestResultsController {
  constructor(
    private readonly sharedTestResultsService: SharedTestResultsService,
  ) {}

  @Post('submit')
  async submitTest(@Body() dto: SubmitTestDto): Promise<TestResultResponse> {
    return this.sharedTestResultsService.submitTest(dto);
  }

  @Get(':testSetId/ranking')
  async getRanking(
    @Param('testSetId', ParseIntPipe) testSetId: number,
    @Query('userId') userId?: string,
    @Query('guestId') guestId?: string,
  ): Promise<RankingResponse> {
    return this.sharedTestResultsService.getRanking(
      testSetId,
      userId ? parseInt(userId) : undefined,
      guestId,
    );
  }

  @Delete(':testSetId/reset')
  async resetRanking(
    @Param('testSetId', ParseIntPipe) testSetId: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.sharedTestResultsService.resetRanking(testSetId);
  }

  @Get('user/submitted')
  async getSubmittedTestIds(
    @Query('userId') userId?: string,
    @Query('guestId') guestId?: string,
  ): Promise<number[]> {
    return this.sharedTestResultsService.getSubmittedTestIds(
      userId ? parseInt(userId) : undefined,
      guestId,
    );
  }

  @Get('report/summary')
  async getScoreReportSummary(@Query('userId', ParseIntPipe) userId: number) {
    return this.sharedTestResultsService.getScoreReportSummary(userId);
  }

  @Get('report/history')
  async getScoreReportHistory(@Query('userId', ParseIntPipe) userId: number) {
    return this.sharedTestResultsService.getScoreReportHistory(userId);
  }

  @Get('wrong-answers')
  async getWrongAnswers(@Query('userId', ParseIntPipe) userId: number) {
    return this.sharedTestResultsService.getWrongAnswers(userId);
  }

  @Get('wrong-answers/:problemId')
  async getWrongAnswerDetail(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.sharedTestResultsService.getWrongAnswerDetail(
      userId,
      problemId,
    );
  }

  @Get('results/:resultId/wrong-answers')
  async getWrongAnswersByResultId(
    @Param('resultId', ParseIntPipe) resultId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.sharedTestResultsService.getWrongAnswersByResultId(
      userId,
      resultId,
    );
  }
}
