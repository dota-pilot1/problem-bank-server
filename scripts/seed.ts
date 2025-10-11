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
      { name: '수학', description: '중학교 수학 문제은행' },
      { name: '영어', description: '중학교 영어 문제은행' },
    ])
    .returning();

  console.log('✅ Subjects created:', subjects.length);

  // 2. Grades 생성 (중1, 중2, 중3)
  const grades = await db
    .insert(schema.grades)
    .values([
      {
        subjectId: subjects[0].id,
        name: '중1',
        displayOrder: 1,
        schoolLevel: 'MIDDLE',
      },
      {
        subjectId: subjects[0].id,
        name: '중2',
        displayOrder: 2,
        schoolLevel: 'MIDDLE',
      },
      {
        subjectId: subjects[0].id,
        name: '중3',
        displayOrder: 3,
        schoolLevel: 'MIDDLE',
      },
    ])
    .returning();

  console.log('✅ Grades created:', grades.length);

  // 3. Chapters 생성 (학년별 단원)
  const chapters = await db
    .insert(schema.chapters)
    .values([
      // 중1 단원
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '수와 연산',
        orderIndex: 1,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '문자와 식',
        orderIndex: 2,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '함수',
        orderIndex: 3,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '기하',
        orderIndex: 4,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '확률과 통계',
        orderIndex: 5,
      },
      // 중2 단원
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '수와 연산',
        orderIndex: 1,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '식의 계산',
        orderIndex: 2,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '함수',
        orderIndex: 3,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '기하',
        orderIndex: 4,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '확률과 통계',
        orderIndex: 5,
      },
      // 중3 단원
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '수와 연산',
        orderIndex: 1,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '다항식',
        orderIndex: 2,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '이차방정식',
        orderIndex: 3,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '함수',
        orderIndex: 4,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '기하',
        orderIndex: 5,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '통계',
        orderIndex: 6,
      },
    ])
    .returning();

  console.log('✅ Chapters created:', chapters.length);

  // 4. Problems 생성 (샘플 문제)
  const problems = await db
    .insert(schema.problems)
    .values([
      // 중1 - 수와 연산
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
        questionText: '(-3) × 4 = ?',
        option1: '-12',
        option2: '12',
        option3: '-7',
        option4: '7',
        correctAnswer: '-12',
        explanation: '음수와 양수의 곱셈은 음수입니다.',
        tags: '곱셈,정수',
      },
      // 중1 - 문자와 식
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
      // 중2 - 식의 계산
      {
        subjectId: subjects[0].id,
        chapterId: chapters[6].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '(x + 2)(x + 3) = ?',
        option1: 'x² + 5x + 6',
        option2: 'x² + 6x + 5',
        option3: 'x² + 5x + 5',
        option4: 'x² + 6x + 6',
        correctAnswer: 'x² + 5x + 6',
        explanation: '전개하면 x² + 3x + 2x + 6 = x² + 5x + 6입니다.',
        tags: '다항식,전개',
      },
      // 중3 - 이차방정식
      {
        subjectId: subjects[0].id,
        chapterId: chapters[12].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: 'x² - 5x + 6 = 0의 해는?',
        option1: 'x = 2, 3',
        option2: 'x = -2, -3',
        option3: 'x = 1, 6',
        option4: 'x = -1, -6',
        correctAnswer: 'x = 2, 3',
        explanation:
          '인수분해하면 (x-2)(x-3) = 0이므로 x = 2 또는 x = 3입니다.',
        tags: '이차방정식,인수분해',
      },
    ])
    .returning();

  console.log('✅ Problems created:', problems.length);

  // 5. Test Sets 생성
  const testSets = await db
    .insert(schema.testSets)
    .values([
      {
        title: '중1 수학 중간고사',
        description: '중1 수학 1-2단원 중간고사',
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        testType: 'MIDTERM',
        totalQuestions: 3,
        timeLimit: 30,
      },
      {
        title: '중2 수학 기말고사',
        description: '중2 수학 전체 범위 기말고사',
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        testType: 'FINAL',
        totalQuestions: 1,
        timeLimit: 40,
      },
      {
        title: '중3 수학 모의고사',
        description: '중3 수학 이차방정식 모의고사',
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        testType: 'MOCK',
        totalQuestions: 1,
        timeLimit: 20,
      },
    ])
    .returning();

  console.log('✅ Test Sets created:', testSets.length);

  // 6. Test Set Problems 연결 (N:M)
  await db.insert(schema.testSetProblems).values([
    // 중1 중간고사
    {
      testSetId: testSets[0].id,
      problemId: problems[0].id,
      orderIndex: 1,
      score: 5,
    },
    {
      testSetId: testSets[0].id,
      problemId: problems[1].id,
      orderIndex: 2,
      score: 5,
    },
    {
      testSetId: testSets[0].id,
      problemId: problems[2].id,
      orderIndex: 3,
      score: 10,
    },
    // 중2 기말고사
    {
      testSetId: testSets[1].id,
      problemId: problems[3].id,
      orderIndex: 1,
      score: 10,
    },
    // 중3 모의고사
    {
      testSetId: testSets[2].id,
      problemId: problems[4].id,
      orderIndex: 1,
      score: 10,
    },
  ]);

  console.log('✅ Test Set Problems connected');
  console.log('🎉 Seed completed!');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
