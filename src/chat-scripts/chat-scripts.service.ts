import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema-tree';
import { CreateChatScriptDto, UpdateChatScriptDto } from './chat-scripts.dto';

@Injectable()
export class ChatScriptsService {
  constructor(
    @Inject('DRIZZLE_DB')
    private db: NodePgDatabase<typeof schema>,
  ) {}

  /**
   * 모든 채팅 스크립트 조회
   */
  async findAll(subject?: string, creatorType?: string) {
    let query = this.db.select().from(schema.chatScripts).$dynamic();

    if (subject && creatorType) {
      query = query.where(
        eq(schema.chatScripts.subject, subject as any) &&
          eq(schema.chatScripts.creatorType, creatorType as any),
      );
    } else if (subject) {
      query = query.where(eq(schema.chatScripts.subject, subject as any));
    } else if (creatorType) {
      query = query.where(
        eq(schema.chatScripts.creatorType, creatorType as any),
      );
    }

    const result = await query.orderBy(desc(schema.chatScripts.createdAt));

    return result;
  }

  /**
   * 특정 채팅 스크립트 조회
   */
  async findOne(id: number) {
    const result = await this.db
      .select()
      .from(schema.chatScripts)
      .where(eq(schema.chatScripts.id, id))
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundException(`Chat script with ID ${id} not found`);
    }

    return result[0];
  }

  /**
   * 채팅 스크립트 생성
   */
  async create(dto: CreateChatScriptDto) {
    const result = await this.db
      .insert(schema.chatScripts)
      .values({
        title: dto.title,
        description: dto.description || null,
        scriptData: dto.scriptData,
        subject: dto.subject,
        creatorType: dto.creatorType || 'SYSTEM',
        creatorId: dto.creatorId || null,
        viewCount: 0,
      })
      .returning();

    return result[0];
  }

  /**
   * 채팅 스크립트 수정
   */
  async update(id: number, dto: UpdateChatScriptDto) {
    await this.findOne(id); // 존재 확인

    const result = await this.db
      .update(schema.chatScripts)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(schema.chatScripts.id, id))
      .returning();

    return result[0];
  }

  /**
   * 채팅 스크립트 삭제
   */
  async remove(id: number) {
    await this.findOne(id); // 존재 확인

    await this.db
      .delete(schema.chatScripts)
      .where(eq(schema.chatScripts.id, id));

    return { deleted: true };
  }

  /**
   * 조회수 증가
   */
  async incrementViewCount(id: number) {
    const script = await this.findOne(id);

    const result = await this.db
      .update(schema.chatScripts)
      .set({
        viewCount: script.viewCount + 1,
      })
      .where(eq(schema.chatScripts.id, id))
      .returning();

    return result[0];
  }

  /**
   * 특정 사용자의 채팅 스크립트 조회
   */
  async findByCreator(creatorId: number) {
    const result = await this.db
      .select()
      .from(schema.chatScripts)
      .where(
        eq(schema.chatScripts.creatorType, 'USER') &&
          eq(schema.chatScripts.creatorId, creatorId),
      )
      .orderBy(desc(schema.chatScripts.createdAt));

    return result;
  }
}
