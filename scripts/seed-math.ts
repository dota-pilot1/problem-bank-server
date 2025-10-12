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

  // 3. Math Problems 생성 - 실제 수학 문제 데이터
  const problemsData: any[] = [];

  // 실제 수학 문제 배열 (중1~중3)
  const realProblems = [
    // === 중1 수학 ===
    // 소인수분해 (3문제)
    {
      chapterId: chapters[0].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      questionText: '72를 소인수분해하면?',
      option1: '2³ × 3²',
      option2: '2² × 3³',
      option3: '2⁴ × 3',
      option4: '2 × 3⁴',
      correctAnswer: '1',
      explanation: '72 = 8 × 9 = 2³ × 3²',
      tags: '소인수분해,중1',
      isActive: true,
    },
    {
      chapterId: chapters[0].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      questionText: '180과 270의 최대공약수는?',
      option1: '30',
      option2: '45',
      option3: '60',
      option4: '90',
      correctAnswer: '4',
      explanation: '180 = 2² × 3² × 5, 270 = 2 × 3³ × 5, GCD = 2 × 3² × 5 = 90',
      tags: '최대공약수,중1',
      isActive: true,
    },
    {
      chapterId: chapters[0].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'HARD' as const,
      questionText: '12, 18, 24의 최소공배수는?',
      option1: '48',
      option2: '72',
      option3: '96',
      option4: '144',
      correctAnswer: '2',
      explanation: 'LCM = 2³ × 3² = 72',
      tags: '최소공배수,중1',
      isActive: true,
    },

    // 정수와 유리수 (3문제)
    {
      chapterId: chapters[1].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      questionText: '(-5) + (+8) = ?',
      option1: '-3',
      option2: '+3',
      option3: '-13',
      option4: '+13',
      correctAnswer: '2',
      explanation: '부호가 다른 두 수의 덧셈: 8 - 5 = 3',
      tags: '정수의 덧셈,중1',
      isActive: true,
    },
    {
      chapterId: chapters[1].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      questionText: '(-3) × (-4) ÷ (+2) = ?',
      option1: '-6',
      option2: '+6',
      option3: '-24',
      option4: '+24',
      correctAnswer: '2',
      explanation: '(-3) × (-4) = +12, 12 ÷ 2 = 6',
      tags: '정수의 곱셈과 나눗셈,중1',
      isActive: true,
    },
    {
      chapterId: chapters[1].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'HARD' as const,
      questionText: '1/2 - 2/3 + 3/4 를 계산하면?',
      option1: '5/12',
      option2: '1/4',
      option3: '7/12',
      option4: '11/12',
      correctAnswer: '3',
      explanation: '통분: 6/12 - 8/12 + 9/12 = 7/12',
      tags: '유리수의 덧셈,중1',
      isActive: true,
    },

    // 문자와 식 (3문제)
    {
      chapterId: chapters[2].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      questionText: '3x + 5x를 간단히 하면?',
      option1: '8x',
      option2: '8x²',
      option3: '15x',
      option4: '2x',
      correctAnswer: '1',
      explanation: '동류항끼리 계수를 더한다',
      tags: '동류항,중1',
      isActive: true,
    },
    {
      chapterId: chapters[2].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      questionText: '2(x + 3) - 3(x - 1)을 전개하면?',
      option1: 'x + 9',
      option2: '-x + 3',
      option3: 'x + 3',
      option4: '-x + 9',
      correctAnswer: '4',
      explanation: '2x + 6 - 3x + 3 = -x + 9',
      tags: '식의 전개,중1',
      isActive: true,
    },
    {
      chapterId: chapters[2].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'HARD' as const,
      questionText: 'x = 2일 때, 3x² - 2x + 1의 값은?',
      option1: '11',
      option2: '13',
      option3: '9',
      option4: '15',
      correctAnswer: '3',
      explanation: '3(4) - 2(2) + 1 = 12 - 4 + 1 = 9',
      tags: '식의 값,중1',
      isActive: true,
    },

    // 일차방정식 (1문제 - 10번째)
    {
      chapterId: chapters[3].id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      questionText: '방정식 2x + 5 = 13을 풀면?',
      option1: 'x = 3',
      option2: 'x = 4',
      option3: 'x = 5',
      option4: 'x = 6',
      correctAnswer: '2',
      explanation: '2x = 13 - 5 = 8, x = 4',
      tags: '일차방정식,중1',
      isActive: true,
    },
  ];

  // 실제 문제 추가
  problemsData.push(...realProblems);

  // 나머지 단원들은 더미 데이터로 채우기
  const difficulties: Array<'EASY' | 'MEDIUM' | 'HARD'> = [
    'EASY',
    'MEDIUM',
    'HARD',
  ];

  for (const chapter of chapters) {
    const existingCount = realProblems.filter(
      (p) => p.chapterId === chapter.id,
    ).length;
    const needCount = 3 - existingCount;

    for (let i = 0; i < needCount; i++) {
      problemsData.push({
        chapterId: chapter.id,
        questionType: 'MULTIPLE_CHOICE' as const,
        difficulty: difficulties[i % 3],
        questionText: `${chapter.name} - ${difficulties[i % 3]} 문제`,
        option1: '선택지 1',
        option2: '선택지 2',
        option3: '선택지 3',
        option4: '선택지 4',
        correctAnswer: '선택지 1',
        explanation: `${chapter.name}의 ${difficulties[i % 3]} 난이도 문제 풀이`,
        tags: `${chapter.name},중학수학`,
        isActive: true,
      });
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
