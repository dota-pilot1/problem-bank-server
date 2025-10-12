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

  // 3. English Problems 생성 (각 단원당 3문제 = 총 63문제)
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
        option1: 'Option 1',
        option2: 'Option 2',
        option3: 'Option 3',
        option4: 'Option 4',
        correctAnswer: 'Option 1',
        explanation: `${chapter.name}의 ${difficulties[i]} 난이도 문제 풀이`,
        tags: `${chapter.name},중학영어`,
        isActive: true,
      });
    }
  }

  const problems = await db
    .insert(schema.englishProblems)
    .values(problemsData)
    .returning();

  console.log('✅ English Problems created:', problems.length);

  await pool.end();
  console.log('🎉 English seed completed!');
}

seedEnglish().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
