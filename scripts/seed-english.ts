import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-english';

async function seedEnglish() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting English seed...');

  // 1. English Chapters 생성 (중1 7단원, 중2 7단원, 중3 7단원 = 총 21단원)
  const chaptersData = [
    // 중1 (7단원) - gradeLevel: 1
    { gradeLevel: 1, name: '인사와 소개', orderIndex: 1 },
    { gradeLevel: 1, name: '일상생활', orderIndex: 2 },
    { gradeLevel: 1, name: '가족과 친구', orderIndex: 3 },
    { gradeLevel: 1, name: '학교생활', orderIndex: 4 },
    { gradeLevel: 1, name: '취미와 여가', orderIndex: 5 },
    { gradeLevel: 1, name: '음식과 식사', orderIndex: 6 },
    { gradeLevel: 1, name: '시간과 날짜', orderIndex: 7 },

    // 중2 (7단원) - gradeLevel: 2
    { gradeLevel: 2, name: '여행과 교통', orderIndex: 1 },
    { gradeLevel: 2, name: '쇼핑과 물건', orderIndex: 2 },
    { gradeLevel: 2, name: '건강과 운동', orderIndex: 3 },
    { gradeLevel: 2, name: '날씨와 계절', orderIndex: 4 },
    { gradeLevel: 2, name: '직업과 진로', orderIndex: 5 },
    { gradeLevel: 2, name: '문화와 축제', orderIndex: 6 },
    { gradeLevel: 2, name: '환경과 자연', orderIndex: 7 },

    // 중3 (7단원) - gradeLevel: 3
    { gradeLevel: 3, name: '사회 문제', orderIndex: 1 },
    { gradeLevel: 3, name: '과학과 기술', orderIndex: 2 },
    { gradeLevel: 3, name: '역사와 인물', orderIndex: 3 },
    { gradeLevel: 3, name: '예술과 음악', orderIndex: 4 },
    { gradeLevel: 3, name: '스포츠와 게임', orderIndex: 5 },
    { gradeLevel: 3, name: '미디어와 뉴스', orderIndex: 6 },
    { gradeLevel: 3, name: '미래와 꿈', orderIndex: 7 },
  ];

  const chapters = await db
    .insert(schema.englishChapters)
    .values(chaptersData)
    .returning();

  console.log('✅ English Chapters created:', chapters.length);

  // 3. English Problems 생성 (각 단원당 레벨별 3문제씩 = 총 315문제)
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
          option1: 'Option 1',
          option2: 'Option 2',
          option3: 'Option 3',
          option4: 'Option 4',
          correctAnswer: 'Option 1',
          explanation: `${chapter.name}의 ${difficulty} 난이도 문제 ${problemNum} 풀이`,
          tags: `${chapter.name},중학영어`,
          isActive: true,
        });
      }
    }
  }

  const problems = await db
    .insert(schema.englishProblems)
    .values(problemsData)
    .returning();

  console.log('✅ English Problems created:', problems.length);

  // 4. English Test Sets 생성 (각 학년당 1개씩 = 총 3개)
  const testSetsData = [
    {
      title: '중1 영어 종합 평가',
      description: '중학교 1학년 전체 단원 종합 평가',
      gradeLevel: 1,
      testType: 'MIDTERM' as const,
      totalQuestions: 10,
      timeLimit: 30,
      isActive: true,
    },
    {
      title: '중2 영어 모의고사',
      description: '중학교 2학년 모의고사',
      gradeLevel: 2,
      testType: 'MOCK' as const,
      totalQuestions: 15,
      timeLimit: 40,
      isActive: true,
    },
    {
      title: '중3 영어 실전 테스트',
      description: '중학교 3학년 실전 대비 테스트',
      gradeLevel: 3,
      testType: 'FINAL' as const,
      totalQuestions: 20,
      timeLimit: 50,
      isActive: true,
    },
  ];

  const testSets = await db
    .insert(schema.englishTestSets)
    .values(testSetsData)
    .returning();

  console.log('✅ English Test Sets created:', testSets.length);

  // 5. English Test Set Problems 연결 (각 시험지에 문제 추가)
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
    .insert(schema.englishTestSetProblems)
    .values(testSetProblemsData)
    .returning();

  console.log(
    '✅ English Test Set Problems linked:',
    testSetProblemsData.length,
  );

  await pool.end();
  console.log('🎉 English seed completed!');
}

seedEnglish().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
