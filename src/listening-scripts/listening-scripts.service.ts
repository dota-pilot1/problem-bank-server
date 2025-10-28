import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import * as listeningSchema from '../drizzle/schema-listening';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateExampleDto } from './dto/create-example.dto';

@Injectable()
export class ListeningScriptsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema & typeof listeningSchema>,
  ) {}

  // ===== 카테고리 관련 =====

  async findAllCategories() {
    return await this.db
      .select()
      .from(listeningSchema.listeningScriptCategories)
      .orderBy(listeningSchema.listeningScriptCategories.displayOrder);
  }

  async findCategoryById(id: number) {
    const [category] = await this.db
      .select()
      .from(listeningSchema.listeningScriptCategories)
      .where(eq(listeningSchema.listeningScriptCategories.id, id));
    return category;
  }

  async createCategory(dto: CreateCategoryDto) {
    const [category] = await this.db
      .insert(listeningSchema.listeningScriptCategories)
      .values(dto)
      .returning();
    return category;
  }

  // ===== 예제 관련 =====

  async findExamplesByCategory(categoryId: number) {
    const examples = await this.db
      .select()
      .from(listeningSchema.listeningScriptExamples)
      .where(eq(listeningSchema.listeningScriptExamples.categoryId, categoryId))
      .orderBy(listeningSchema.listeningScriptExamples.displayOrder);

    // 각 예제의 메시지 로드
    const examplesWithMessages = await Promise.all(
      examples.map(async (example) => {
        const messages = await this.db
          .select()
          .from(listeningSchema.listeningScriptExampleMessages)
          .where(
            eq(
              listeningSchema.listeningScriptExampleMessages.exampleId,
              example.id,
            ),
          )
          .orderBy(
            listeningSchema.listeningScriptExampleMessages.displayOrder,
          );

        return {
          ...example,
          messageCount: messages.length,
          messages,
        };
      }),
    );

    return examplesWithMessages;
  }

  async findExampleById(id: number) {
    const [example] = await this.db
      .select()
      .from(listeningSchema.listeningScriptExamples)
      .where(eq(listeningSchema.listeningScriptExamples.id, id));

    if (!example) {
      return null;
    }

    const messages = await this.db
      .select()
      .from(listeningSchema.listeningScriptExampleMessages)
      .where(eq(listeningSchema.listeningScriptExampleMessages.exampleId, id))
      .orderBy(listeningSchema.listeningScriptExampleMessages.displayOrder);

    return {
      ...example,
      messageCount: messages.length,
      messages,
    };
  }

  async createExample(dto: CreateExampleDto) {
    // 1. 예제 생성
    const [example] = await this.db
      .insert(listeningSchema.listeningScriptExamples)
      .values({
        categoryId: dto.categoryId,
        title: dto.title,
        description: dto.description,
        styleType: dto.styleType,
        displayOrder: dto.displayOrder || 0,
        viewCount: 0,
        likeCount: 0,
      })
      .returning();

    // 2. 메시지 생성
    if (dto.messages && dto.messages.length > 0) {
      const messageValues = dto.messages.map((msg) => ({
        exampleId: example.id,
        role: msg.role,
        message: msg.message,
        displayOrder: msg.displayOrder,
      }));

      await this.db
        .insert(listeningSchema.listeningScriptExampleMessages)
        .values(messageValues);
    }

    // 3. 생성된 예제 반환 (메시지 포함)
    return await this.findExampleById(example.id);
  }

  async incrementViewCount(id: number) {
    const example = await this.findExampleById(id);
    if (!example) {
      throw new Error(`Example with id ${id} not found`);
    }

    await this.db
      .update(listeningSchema.listeningScriptExamples)
      .set({ viewCount: example.viewCount + 1 })
      .where(eq(listeningSchema.listeningScriptExamples.id, id));

    return { success: true };
  }

  async countExamplesByCategory(categoryId: number) {
    const examples = await this.db
      .select()
      .from(listeningSchema.listeningScriptExamples)
      .where(eq(listeningSchema.listeningScriptExamples.categoryId, categoryId));

    return examples.length;
  }
}
