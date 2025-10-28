import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ListeningQuestionsService } from './listening-questions.service';
import { CreateListeningQuestionDto } from './dto/create-listening-question.dto';
import { UpdateListeningQuestionDto } from './dto/update-listening-question.dto';

@Controller('listening-questions')
export class ListeningQuestionsController {
  constructor(
    private readonly listeningQuestionsService: ListeningQuestionsService,
  ) {}

  @Post()
  create(@Body() createDto: CreateListeningQuestionDto) {
    return this.listeningQuestionsService.create(createDto);
  }

  @Get()
  findAll(@Query('subject') subject?: string) {
    return this.listeningQuestionsService.findAll(subject);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listeningQuestionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateListeningQuestionDto,
  ) {
    return this.listeningQuestionsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.listeningQuestionsService.remove(id);
  }
}
