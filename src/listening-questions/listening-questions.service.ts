import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema-listening';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateListeningQuestionDto } from './dto/create-listening-question.dto';
import { UpdateListeningQuestionDto } from './dto/update-listening-question.dto';

@Injectable()
export class ListeningQuestionsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateListeningQuestionDto) {
    const [question] = await this.db
      .insert(schema.listeningQuestions)
      .values({
        subject: dto.subject,
        questionText: dto.questionText,
        listeningType: dto.listeningType,
        listeningText: dto.listeningText ?? null,
        script: dto.script ?? null,
        choices: dto.choices,
        correctAnswer: dto.correctAnswer,
        difficulty: dto.difficulty,
      })
      .returning();

    return question;
  }

  async findAll(subject?: string) {
    if (subject) {
      return await this.db
        .select()
        .from(schema.listeningQuestions)
        .where(eq(schema.listeningQuestions.subject, subject))
        .orderBy(schema.listeningQuestions.createdAt);
    }

    return await this.db
      .select()
      .from(schema.listeningQuestions)
      .orderBy(schema.listeningQuestions.createdAt);
  }

  async findOne(id: number) {
    const [question] = await this.db
      .select()
      .from(schema.listeningQuestions)
      .where(eq(schema.listeningQuestions.id, id))
      .limit(1);

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: number, dto: UpdateListeningQuestionDto) {
    const [updated] = await this.db
      .update(schema.listeningQuestions)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(schema.listeningQuestions.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: number) {
    const [deleted] = await this.db
      .delete(schema.listeningQuestions)
      .where(eq(schema.listeningQuestions.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return { message: 'Question deleted successfully', id };
  }
}
