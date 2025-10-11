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
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @Get()
  findAll(
    @Query('subjectId') subjectId?: string,
    @Query('gradeId') gradeId?: string,
  ) {
    if (gradeId) {
      return this.chaptersService.findByGrade(+gradeId);
    }
    if (subjectId) {
      return this.chaptersService.findBySubject(+subjectId);
    }
    return this.chaptersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChapterDto: Partial<CreateChapterDto>,
  ) {
    return this.chaptersService.update(+id, updateChapterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chaptersService.remove(+id);
  }
}
