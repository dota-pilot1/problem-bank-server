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
import { TestSetsService } from './test-sets.service';
import { CreateTestSetDto } from './dto/create-test-set.dto';
import { AddProblemDto } from './dto/add-problem.dto';

@Controller('test-sets')
export class TestSetsController {
  constructor(private readonly testSetsService: TestSetsService) {}

  @Post()
  create(@Body() createTestSetDto: CreateTestSetDto) {
    return this.testSetsService.create(createTestSetDto);
  }

  @Get()
  findAll(@Query('gradeId') gradeId?: string) {
    return this.testSetsService.findAll(gradeId ? +gradeId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testSetsService.findOne(+id);
  }

  @Get(':id/problems')
  findProblems(@Param('id') id: string) {
    return this.testSetsService.findProblems(+id);
  }

  @Post(':id/problems')
  addProblem(@Param('id') id: string, @Body() addProblemDto: AddProblemDto) {
    return this.testSetsService.addProblem(+id, addProblemDto);
  }

  @Delete(':id/problems/:problemId')
  removeProblem(
    @Param('id') id: string,
    @Param('problemId') problemId: string,
  ) {
    return this.testSetsService.removeProblem(+id, +problemId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestSetDto: Partial<CreateTestSetDto>,
  ) {
    return this.testSetsService.update(+id, updateTestSetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testSetsService.remove(+id);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.testSetsService.publish(+id);
  }

  @Post(':id/unpublish')
  unpublish(@Param('id') id: string) {
    return this.testSetsService.unpublish(+id);
  }

  @Get('published/list')
  findPublished(@Query('gradeId') gradeId?: string) {
    return this.testSetsService.findPublished(gradeId ? +gradeId : undefined);
  }
}
