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
}
