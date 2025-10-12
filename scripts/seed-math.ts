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

  // 3. Math Problems 생성 (각 단원당 3문제 = 총 63문제)
  const problemsData: any[] = [];
  const difficulties: Array<'EASY' | 'MEDIUM' | 'HARD'> = [
    'EASY',
    'MEDIUM',
    'HARD',
  ];

  for (const chapter of chapters) {
    for (let i = 0; i < 3; i++) {
      problemsData.push({
        chapterId: chapter.id,
        questionType: 'MULTIPLE_CHOICE' as const,
        difficulty: difficulties[i],
        questionText: `${chapter.name} - ${difficulties[i]} 문제`,
        option1: '선택지 1',
        option2: '선택지 2',
        option3: '선택지 3',
        option4: '선택지 4',
        correctAnswer: '선택지 1',
        explanation: `${chapter.name}의 ${difficulties[i]} 난이도 문제 풀이`,
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

  await pool.end();
  console.log('🎉 Math seed completed!');
}

seedMath().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
