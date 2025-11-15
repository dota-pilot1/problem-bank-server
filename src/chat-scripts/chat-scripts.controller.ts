import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ChatScriptsService } from './chat-scripts.service';
import { CreateChatScriptDto, UpdateChatScriptDto } from './chat-scripts.dto';

@Controller('chat-scripts')
export class ChatScriptsController {
  constructor(private readonly chatScriptsService: ChatScriptsService) {}

  /**
   * GET /chat-scripts
   * 모든 채팅 스크립트 조회
   */
  @Get()
  async findAll(
    @Query('subject') subject?: string,
    @Query('creatorType') creatorType?: string,
  ) {
    return this.chatScriptsService.findAll(subject, creatorType);
  }

  /**
   * GET /chat-scripts/:id
   * 특정 채팅 스크립트 조회
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chatScriptsService.findOne(id);
  }

  /**
   * GET /chat-scripts/creator/:creatorId
   * 특정 사용자의 채팅 스크립트 조회
   */
  @Get('creator/:creatorId')
  async findByCreator(@Param('creatorId', ParseIntPipe) creatorId: number) {
    return this.chatScriptsService.findByCreator(creatorId);
  }

  /**
   * POST /chat-scripts
   * 채팅 스크립트 생성
   */
  @Post()
  async create(@Body() dto: CreateChatScriptDto) {
    return this.chatScriptsService.create(dto);
  }

  /**
   * PUT /chat-scripts/:id
   * 채팅 스크립트 수정
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChatScriptDto,
  ) {
    return this.chatScriptsService.update(id, dto);
  }

  /**
   * PATCH /chat-scripts/:id/view
   * 조회수 증가
   */
  @Patch(':id/view')
  async incrementViewCount(@Param('id', ParseIntPipe) id: number) {
    return this.chatScriptsService.incrementViewCount(id);
  }

  /**
   * DELETE /chat-scripts/:id
   * 채팅 스크립트 삭제
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatScriptsService.remove(id);
  }
}
