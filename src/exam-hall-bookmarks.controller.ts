import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ExamHallBookmarksService } from './exam-hall-bookmarks.service';
import {
  CreateBookmarkDto,
  BookmarkResponse,
  BookmarkedTestSetResponse,
} from './exam-hall-bookmarks.dto';

@Controller('exam-hall-bookmarks')
export class ExamHallBookmarksController {
  constructor(
    private readonly examHallBookmarksService: ExamHallBookmarksService,
  ) {}

  @Post()
  async addBookmark(
    @Body() dto: CreateBookmarkDto,
  ): Promise<BookmarkResponse> {
    return this.examHallBookmarksService.addBookmark(dto);
  }

  @Get()
  async getBookmarks(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('subject') subject: 'ENGLISH' | 'MATH',
  ): Promise<BookmarkedTestSetResponse[]> {
    return this.examHallBookmarksService.getBookmarks(userId, subject);
  }

  @Delete(':id')
  async deleteBookmark(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string }> {
    await this.examHallBookmarksService.deleteBookmark(id, userId);
    return { message: '북마크가 삭제되었습니다' };
  }
}
