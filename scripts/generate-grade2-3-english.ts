import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-english';

// 중2, 중3 영어 14개 단원 × 5레벨 × 3문제 = 210문제 생성

async function generateGrade23EnglishProblems() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting Grade 2-3 English Problems Generation...');

  const chapters = await db.select().from(schema.englishChapters);
  console.log('✅ Loaded chapters:', chapters.length);

  const allProblems: any[] = [];

  // 중2 7개 단원
  const grade2Chapters = [
    { order: 1, name: '시제' },
    { order: 2, name: '조동사' },
    { order: 3, name: '비교급과 최상급' },
    { order: 4, name: '부정사' },
    { order: 5, name: '동명사' },
    { order: 6, name: '접속사' },
    { order: 7, name: '문장의 형식' },
  ];

  grade2Chapters.forEach(({ order, name }) => {
    const chapter = chapters.find((c) => c.gradeLevel === 2 && c.orderIndex === order);
    if (chapter) {
      for (let level = 1; level <= 5; level++) {
        for (let i = 1; i <= 3; i++) {
          allProblems.push({
            chapterId: chapter.id,
            questionType: 'MULTIPLE_CHOICE',
            difficulty: `LEVEL_${level}`,
            questionText: `${name} 문제 ${level}-${i}`,
            option1: '정답',
            option2: '오답1',
            option3: '오답2',
            option4: '오답3',
            correctAnswer: '1',
            explanation: `${name} 설명`,
            tags: `${name},중2영어`,
          });
        }
      }
    }
  });

  // 중3 7개 단원
  const grade3Chapters = [
    { order: 1, name: '수동태' },
    { order: 2, name: '현재완료' },
    { order: 3, name: '관계대명사' },
    { order: 4, name: '가정법' },
    { order: 5, name: '분사' },
    { order: 6, name: '간접의문문' },
    { order: 7, name: '관계부사' },
  ];

  grade3Chapters.forEach(({ order, name }) => {
    const chapter = chapters.find((c) => c.gradeLevel === 3 && c.orderIndex === order);
    if (chapter) {
      for (let level = 1; level <= 5; level++) {
        for (let i = 1; i <= 3; i++) {
          allProblems.push({
            chapterId: chapter.id,
            questionType: 'MULTIPLE_CHOICE',
            difficulty: `LEVEL_${level}`,
            questionText: `${name} 문제 ${level}-${i}`,
            option1: '정답',
            option2: '오답1',
            option3: '오답2',
            option4: '오답3',
            correctAnswer: '1',
            explanation: `${name} 설명`,
            tags: `${name},중3영어`,
          });
        }
      }
    }
  });

  console.log('✅ Grade 2-3 English Problems prepared:', allProblems.length);

  if (allProblems.length > 0) {
    const problems = await db
      .insert(schema.englishProblems)
      .values(allProblems)
      .returning();

    console.log('✅ Grade 2-3 English Problems inserted:', problems.length);
  }

  await pool.end();
  console.log('🎉 Grade 2-3 English Problems Generation completed!');
}

generateGrade23EnglishProblems().catch(console.error);
