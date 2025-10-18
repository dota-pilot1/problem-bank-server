import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-math';

async function generateGrade23MathProblems() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });
  console.log('🌱 Starting Grade 2-3 Math Problems Generation...');

  const chapters = await db.select().from(schema.mathChapters);
  console.log('✅ Loaded chapters:', chapters.length);

  const allProblems: any[] = [];

  // 중2 7개 단원 + 중3 7개 단원 = 14개 단원
  const grade2Chapters = [
    { order: 1, name: '유리수와 순환소수' },
    { order: 2, name: '단항식의 계산' },
    { order: 3, name: '다항식의 계산' },
    { order: 4, name: '일차부등식' },
    { order: 5, name: '연립일차방정식' },
    { order: 6, name: '일차함수' },
    { order: 7, name: '확률' },
  ];

  const grade3Chapters = [
    { order: 1, name: '제곱근과 실수' },
    { order: 2, name: '다항식의 곱셈' },
    { order: 3, name: '인수분해' },
    { order: 4, name: '이차방정식' },
    { order: 5, name: '이차함수' },
    { order: 6, name: '삼각비' },
    { order: 7, name: '원의 성질' },
  ];

  // 중2
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
            tags: `${name},중2수학`,
          });
        }
      }
    }
  });

  // 중3
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
            tags: `${name},중3수학`,
          });
        }
      }
    }
  });

  console.log('✅ Grade 2-3 Math Problems prepared:', allProblems.length);

  if (allProblems.length > 0) {
    const problems = await db
      .insert(schema.mathProblems)
      .values(allProblems)
      .returning();

    console.log('✅ Grade 2-3 Math Problems inserted:', problems.length);
  }

  await pool.end();
  console.log('🎉 Grade 2-3 Math Problems Generation completed!');
}

generateGrade23MathProblems().catch(console.error);
