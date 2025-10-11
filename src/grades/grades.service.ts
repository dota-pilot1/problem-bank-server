import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateGradeDto } from './dto/create-grade.dto';

@Injectable()
export class GradesService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createGradeDto: CreateGradeDto) {
    const [grade] = await this.db
      .insert(schema.grades)
      .values(createGradeDto)
      .returning();
    return grade;
  }

  async findAll(subjectId?: number) {
    if (subjectId) {
      return await this.db
        .select()
        .from(schema.grades)
        .where(eq(schema.grades.subjectId, subjectId))
        .orderBy(schema.grades.displayOrder);
    }
    return await this.db
      .select()
      .from(schema.grades)
      .orderBy(schema.grades.displayOrder);
  }

  async findOne(id: number) {
    const [grade] = await this.db
      .select()
      .from(schema.grades)
      .where(eq(schema.grades.id, id));
    return grade;
  }

  async update(id: number, updateGradeDto: Partial<CreateGradeDto>) {
    const [grade] = await this.db
      .update(schema.grades)
      .set(updateGradeDto)
      .where(eq(schema.grades.id, id))
      .returning();
    return grade;
  }

  async remove(id: number) {
    await this.db.delete(schema.grades).where(eq(schema.grades.id, id));
    return { deleted: true };
  }
}
