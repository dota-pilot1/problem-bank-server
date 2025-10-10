import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema';

async function seed() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting seed...');

  // 1. Subjects 생성 (단순화: 수학, 영어만)
  const subjects = await db
    .insert(schema.subjects)
    .values([
      { name: '수학', description: '수학 문제' },
      { name: '영어', description: '영어 문제' },
    ])
    .returning();

  console.log('✅ Subjects created:', subjects.length);

  // 2. Sample Problems 생성 (모두 객관식)
  await db.insert(schema.problems).values([
    {
      subjectId: subjects[0].id, // 수학
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      questionText: '2 + 2 = ?',
      option1: '3',
      option2: '4',
      option3: '5',
      option4: '6',
      correctAnswer: '4',
      explanation: '2 더하기 2는 4입니다.',
      tags: '덧셈,기초',
    },
    {
      subjectId: subjects[0].id, // 수학
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      questionText: '15 × 3 = ?',
      option1: '35',
      option2: '45',
      option3: '55',
      option4: '65',
      correctAnswer: '45',
      explanation: '15 곱하기 3은 45입니다.',
      tags: '곱셈,연산',
    },
    {
      subjectId: subjects[1].id, // 영어
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      questionText: 'What is the capital of Korea?',
      option1: 'Seoul',
      option2: 'Busan',
      option3: 'Incheon',
      option4: 'Daegu',
      correctAnswer: 'Seoul',
      explanation: 'The capital of Korea is Seoul.',
      tags: 'geography,capital',
    },
    {
      subjectId: subjects[1].id, // 영어
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      questionText: 'I ___ to school every day.',
      option1: 'go',
      option2: 'goes',
      option3: 'going',
      option4: 'went',
      correctAnswer: 'go',
      explanation: 'I는 1인칭 주어이므로 동사 원형 "go"를 사용합니다.',
      tags: 'grammar,verb',
    },
  ]);

  console.log('✅ Sample problems created: 4');
  console.log('🎉 Seed completed!');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
