import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const [subject] = await this.db
      .insert(schema.subjects)
      .values(createSubjectDto)
      .returning();
    return subject;
  }

  async findAll() {
    return await this.db.select().from(schema.subjects);
  }

  async findOne(id: number) {
    const [subject] = await this.db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.id, id));
    return subject;
  }

  async update(id: number, updateSubjectDto: Partial<CreateSubjectDto>) {
    const [subject] = await this.db
      .update(schema.subjects)
      .set(updateSubjectDto)
      .where(eq(schema.subjects.id, id))
      .returning();
    return subject;
  }

  async remove(id: number) {
    await this.db.delete(schema.subjects).where(eq(schema.subjects.id, id));
    return { deleted: true };
  }
}
