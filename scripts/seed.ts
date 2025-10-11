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

  // 1. Subjects 생성
  const subjects = await db
    .insert(schema.subjects)
    .values([
      { name: '수학', description: '수학 문제' },
      { name: '영어', description: '영어 문제' },
    ])
    .returning();

  console.log('✅ Subjects created:', subjects.length);

  // 2. Chapters 생성 (수학만)
  const chapters = await db
    .insert(schema.chapters)
    .values([
      {
        subjectId: subjects[0].id,
        name: '1. 수와 연산',
        orderIndex: 1,
      },
      {
        subjectId: subjects[0].id,
        name: '2. 문자와 식',
        orderIndex: 2,
      },
      {
        subjectId: subjects[0].id,
        name: '3. 함수',
        orderIndex: 3,
      },
    ])
    .returning();

  console.log('✅ Chapters created:', chapters.length);

  // 3. Problems 생성
  const problems = await db
    .insert(schema.problems)
    .values([
      // 수학 - 수와 연산
      {
        subjectId: subjects[0].id,
        chapterId: chapters[0].id,
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
        subjectId: subjects[0].id,
        chapterId: chapters[0].id,
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
      // 수학 - 문자와 식
      {
        subjectId: subjects[0].id,
        chapterId: chapters[1].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: 'x + 5 = 10일 때, x의 값은?',
        option1: '3',
        option2: '5',
        option3: '10',
        option4: '15',
        correctAnswer: '5',
        explanation: 'x = 10 - 5 = 5입니다.',
        tags: '일차방정식',
      },
      // 영어 (단원 없음)
      {
        subjectId: subjects[1].id,
        chapterId: null,
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
        subjectId: subjects[1].id,
        chapterId: null,
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
    ])
    .returning();

  console.log('✅ Problems created:', problems.length);

  // 4. Test Sets 생성
  const testSets = await db
    .insert(schema.testSets)
    .values([
      {
        title: 'Daily Test (12/15)',
        description: '일일 테스트',
        testType: 'DAILY',
        totalQuestions: 3,
        timeLimit: 10,
      },
      {
        title: '수학 중간고사',
        description: '수학 1-2단원 중간고사',
        subjectId: subjects[0].id,
        testType: 'MIDTERM',
        totalQuestions: 3,
        timeLimit: 30,
      },
    ])
    .returning();

  console.log('✅ Test Sets created:', testSets.length);

  // 5. Test Set Problems 연결 (N:M)
  await db.insert(schema.testSetProblems).values([
    // Daily Test (수학 1개 + 영어 2개)
    { testSetId: testSets[0].id, problemId: problems[0].id, orderIndex: 1 },
    { testSetId: testSets[0].id, problemId: problems[3].id, orderIndex: 2 },
    { testSetId: testSets[0].id, problemId: problems[4].id, orderIndex: 3 },

    // 수학 중간고사 (수학 문제 3개)
    { testSetId: testSets[1].id, problemId: problems[0].id, orderIndex: 1 },
    { testSetId: testSets[1].id, problemId: problems[1].id, orderIndex: 2 },
    { testSetId: testSets[1].id, problemId: problems[2].id, orderIndex: 3 },
  ]);

  console.log('✅ Test Set Problems connected');
  console.log('🎉 Seed completed!');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
