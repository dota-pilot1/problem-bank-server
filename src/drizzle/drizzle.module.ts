import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import * as englishSchema from './schema-english';
import * as mathSchema from './schema-math';

// 모든 스키마 병합
const allSchemas = { ...schema, ...englishSchema, ...mathSchema };

export const DRIZZLE_ORM = Symbol('DRIZZLE_ORM');

@Module({
  providers: [
    {
      provide: DRIZZLE_ORM,
      useFactory: async (): Promise<NodePgDatabase<typeof allSchemas>> => {
        const pool = new Pool({
          host: 'localhost',
          port: 5433,
          user: 'user',
          password: 'password',
          database: 'problem-bank',
        });

        return drizzle(pool, { schema: allSchemas });
      },
    },
  ],
  exports: [DRIZZLE_ORM],
})
export class DrizzleModule {}
