import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateProblemDto } from './dto/create-problem.dto';

@Injectable()
export class ProblemsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createProblemDto: CreateProblemDto) {
    const [problem] = await this.db
      .insert(schema.problems)
      .values(createProblemDto)
      .returning();
    return problem;
  }

  async findAll() {
    return await this.db.select().from(schema.problems);
  }

  async findOne(id: number) {
    const [problem] = await this.db
      .select()
      .from(schema.problems)
      .where(eq(schema.problems.id, id));
    return problem;
  }

  async update(id: number, updateProblemDto: Partial<CreateProblemDto>) {
    const [problem] = await this.db
      .update(schema.problems)
      .set(updateProblemDto)
      .where(eq(schema.problems.id, id))
      .returning();
    return problem;
  }

  async remove(id: number) {
    await this.db.delete(schema.problems).where(eq(schema.problems.id, id));
    return { deleted: true };
  }
}
