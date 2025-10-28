import type { Config } from 'drizzle-kit';

export default {
  schema: [
    './src/drizzle/schema.ts',
    './src/drizzle/schema-math.ts',
    './src/drizzle/schema-english.ts',
    './src/drizzle/schema-listening.ts',
  ],
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
    ssl: false,
  },
} satisfies Config;
