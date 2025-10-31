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
}
