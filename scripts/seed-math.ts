import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-math';

async function seedMath() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting Math seed...');

  // 1. Math Chapters 생성 (중1 7단원, 중2 7단원, 중3 7단원 = 총 21단원)
  const chaptersData = [
    // 중1 (7단원) - gradeLevel: 1
    { gradeLevel: 1, name: '소인수분해', orderIndex: 1 },
    { gradeLevel: 1, name: '정수와 유리수', orderIndex: 2 },
    { gradeLevel: 1, name: '문자와 식', orderIndex: 3 },
    { gradeLevel: 1, name: '일차방정식', orderIndex: 4 },
    { gradeLevel: 1, name: '좌표평면과 그래프', orderIndex: 5 },
    { gradeLevel: 1, name: '통계', orderIndex: 6 },
    { gradeLevel: 1, name: '기본 도형', orderIndex: 7 },

    // 중2 (7단원) - gradeLevel: 2
    { gradeLevel: 2, name: '유리수와 순환소수', orderIndex: 1 },
    { gradeLevel: 2, name: '단항식의 계산', orderIndex: 2 },
    { gradeLevel: 2, name: '다항식의 계산', orderIndex: 3 },
    { gradeLevel: 2, name: '일차부등식', orderIndex: 4 },
    { gradeLevel: 2, name: '연립일차방정식', orderIndex: 5 },
    { gradeLevel: 2, name: '일차함수', orderIndex: 6 },
    { gradeLevel: 2, name: '확률', orderIndex: 7 },

    // 중3 (7단원) - gradeLevel: 3
    { gradeLevel: 3, name: '제곱근과 실수', orderIndex: 1 },
    { gradeLevel: 3, name: '다항식의 곱셈', orderIndex: 2 },
    { gradeLevel: 3, name: '인수분해', orderIndex: 3 },
    { gradeLevel: 3, name: '이차방정식', orderIndex: 4 },
    { gradeLevel: 3, name: '이차함수', orderIndex: 5 },
    { gradeLevel: 3, name: '삼각비', orderIndex: 6 },
    { gradeLevel: 3, name: '원의 성질', orderIndex: 7 },
  ];

  const chapters = await db
    .insert(schema.mathChapters)
    .values(chaptersData)
    .returning();

  console.log('✅ Math Chapters created:', chapters.length);

  // 3. Math Problems 생성 (각 단원당 레벨별 3문제씩 = 총 315문제)
  const problemsData: any[] = [];
  const difficulties: Array<
    'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5'
  > = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5'];

  for (const chapter of chapters) {
    for (const difficulty of difficulties) {
      for (let problemNum = 1; problemNum <= 3; problemNum++) {
        problemsData.push({
          chapterId: chapter.id,
          questionType: 'MULTIPLE_CHOICE' as const,
          difficulty: difficulty,
          questionText: `${chapter.name} - ${difficulty} 문제 ${problemNum}`,
          option1: '선택지 1',
          option2: '선택지 2',
          option3: '선택지 3',
          option4: '선택지 4',
          correctAnswer: '선택지 1',
          explanation: `${chapter.name}의 ${difficulty} 난이도 문제 ${problemNum} 풀이`,
          tags: `${chapter.name},중학수학`,
          isActive: true,
        });
      }
    }
  }

  const problems = await db
    .insert(schema.mathProblems)
    .values(problemsData)
    .returning();

  console.log('✅ Math Problems created:', problems.length);

  // 4. Math Test Sets 생성 (각 학년당 1개씩 = 총 3개)
  const testSetsData = [
    {
      title: '중1 수학 종합 평가',
      description: '중학교 1학년 전체 단원 종합 평가',
      gradeLevel: 1,
      testType: 'MIDTERM' as const,
      totalQuestions: 10,
      timeLimit: 30,
      isActive: true,
    },
    {
      title: '중2 수학 모의고사',
      description: '중학교 2학년 모의고사',
      gradeLevel: 2,
      testType: 'MOCK' as const,
      totalQuestions: 15,
      timeLimit: 40,
      isActive: true,
    },
    {
      title: '중3 수학 실전 테스트',
      description: '중학교 3학년 실전 대비 테스트',
      gradeLevel: 3,
      testType: 'FINAL' as const,
      totalQuestions: 20,
      timeLimit: 50,
      isActive: true,
    },
  ];

  const testSets = await db
    .insert(schema.mathTestSets)
    .values(testSetsData)
    .returning();

  console.log('✅ Math Test Sets created:', testSets.length);

  // 5. Math Test Set Problems 연결 (각 시험지에 문제 추가)
  const testSetProblemsData: any[] = [];

  for (let i = 0; i < testSets.length; i++) {
    const testSet = testSets[i];
    const gradeLevel = i + 1;

    // 해당 학년의 문제들만 필터링
    const gradeProblems = problems.filter((p) => {
      const chapter = chapters.find((c) => c.id === p.chapterId);
      return chapter?.gradeLevel === gradeLevel;
    });

    // 각 시험지의 totalQuestions만큼 문제 추가
    const selectedProblems = gradeProblems.slice(0, testSet.totalQuestions);

    selectedProblems.forEach((problem, index) => {
      testSetProblemsData.push({
        testSetId: testSet.id,
        problemId: problem.id,
        orderIndex: index + 1,
        score: 5,
      });
    });
  }

  await db
    .insert(schema.mathTestSetProblems)
    .values(testSetProblemsData)
    .returning();

  console.log('✅ Math Test Set Problems linked:', testSetProblemsData.length);

  await pool.end();
  console.log('🎉 Math seed completed!');
}

seedMath().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
