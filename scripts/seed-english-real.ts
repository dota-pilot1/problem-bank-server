import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-english';

async function seedEnglishReal() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting Real English seed...');

  // 1. English Chapters 생성
  const chaptersData = [
    // 중1
    { gradeLevel: 1, name: 'be동사', orderIndex: 1 },
    { gradeLevel: 1, name: '일반동사', orderIndex: 2 },
    { gradeLevel: 1, name: '명사와 관사', orderIndex: 3 },
    { gradeLevel: 1, name: '대명사', orderIndex: 4 },
    { gradeLevel: 1, name: '형용사', orderIndex: 5 },
    { gradeLevel: 1, name: '부사', orderIndex: 6 },
    { gradeLevel: 1, name: '전치사', orderIndex: 7 },

    // 중2
    { gradeLevel: 2, name: '시제', orderIndex: 1 },
    { gradeLevel: 2, name: '조동사', orderIndex: 2 },
    { gradeLevel: 2, name: '부정사', orderIndex: 3 },
    { gradeLevel: 2, name: '동명사', orderIndex: 4 },
    { gradeLevel: 2, name: '비교급과 최상급', orderIndex: 5 },
    { gradeLevel: 2, name: '접속사', orderIndex: 6 },
    { gradeLevel: 2, name: '문장의 형식', orderIndex: 7 },

    // 중3
    { gradeLevel: 3, name: '현재완료', orderIndex: 1 },
    { gradeLevel: 3, name: '수동태', orderIndex: 2 },
    { gradeLevel: 3, name: '관계대명사', orderIndex: 3 },
    { gradeLevel: 3, name: '분사', orderIndex: 4 },
    { gradeLevel: 3, name: '가정법', orderIndex: 5 },
    { gradeLevel: 3, name: '간접화법', orderIndex: 6 },
    { gradeLevel: 3, name: '특수구문', orderIndex: 7 },
  ];

  const chapters = await db
    .insert(schema.englishChapters)
    .values(chaptersData)
    .returning();

  console.log('✅ English Chapters created:', chapters.length);

  // 실제 영어 문제 데이터
  const realProblems: any[] = [];

  // 중1 - be동사 (chapters[0])
  const chapter1 = chapters[0];
  realProblems.push(
    // LEVEL_1 - 기초
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: 'I ___ a student.',
      option1: 'am',
      option2: 'is',
      option3: 'are',
      option4: 'be',
      correctAnswer: '1',
      explanation: '주어가 I일 때 be동사는 am을 사용합니다.',
      tags: 'be동사,중1영어,기초',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: 'She ___ my sister.',
      option1: 'is',
      option2: 'am',
      option3: 'are',
      option4: 'be',
      correctAnswer: '1',
      explanation: '주어가 3인칭 단수(she)일 때 be동사는 is를 사용합니다.',
      tags: 'be동사,중1영어,기초',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: 'They ___ my friends.',
      option1: 'are',
      option2: 'is',
      option3: 'am',
      option4: 'be',
      correctAnswer: '1',
      explanation: '주어가 복수(they)일 때 be동사는 are를 사용합니다.',
      tags: 'be동사,중1영어,기초',
      isActive: true,
    },

    // LEVEL_2 - 중급
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: 'He ___ not happy.',
      option1: 'is',
      option2: 'are',
      option3: 'am',
      option4: 'be',
      correctAnswer: '1',
      explanation: '부정문에서도 주어에 맞는 be동사를 사용합니다. He는 is를 씁니다.',
      tags: 'be동사,부정문,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: '___ you a teacher?',
      option1: 'Are',
      option2: 'Is',
      option3: 'Am',
      option4: 'Be',
      correctAnswer: '1',
      explanation: '의문문에서 주어가 you일 때 Are를 문장 앞에 씁니다.',
      tags: 'be동사,의문문,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: 'We ___ not late.',
      option1: 'are',
      option2: 'is',
      option3: 'am',
      option4: 'was',
      correctAnswer: '1',
      explanation: '주어 we는 복수이므로 are를 사용합니다.',
      tags: 'be동사,부정문,중1영어',
      isActive: true,
    },

    // LEVEL_3 - 고급
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: 'The book ___ on the table.',
      option1: 'is',
      option2: 'are',
      option3: 'am',
      option4: 'be',
      correctAnswer: '1',
      explanation: '주어 the book은 단수이므로 is를 사용합니다.',
      tags: 'be동사,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: 'Tom and I ___ good friends.',
      option1: 'are',
      option2: 'is',
      option3: 'am',
      option4: 'was',
      correctAnswer: '1',
      explanation: 'Tom and I는 복수이므로 are를 사용합니다.',
      tags: 'be동사,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: '___ he your brother?',
      option1: 'Is',
      option2: 'Are',
      option3: 'Am',
      option4: 'Be',
      correctAnswer: '1',
      explanation: '의문문에서 주어가 he일 때 Is를 문장 앞에 씁니다.',
      tags: 'be동사,의문문,중1영어',
      isActive: true,
    },

    // LEVEL_4 - 심화
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_4' as const,
      questionText: 'There ___ three books on the desk.',
      option1: 'are',
      option2: 'is',
      option3: 'am',
      option4: 'be',
      correctAnswer: '1',
      explanation: 'There is/are 구문에서 뒤에 오는 명사가 복수(three books)이므로 are를 씁니다.',
      tags: 'be동사,There구문,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_4' as const,
      questionText: 'What ___ your name?',
      option1: 'is',
      option2: 'are',
      option3: 'am',
      option4: 'be',
      correctAnswer: '1',
      explanation: '주어 your name은 단수이므로 is를 사용합니다.',
      tags: 'be동사,의문사,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_4' as const,
      questionText: 'My parents ___ very kind.',
      option1: 'are',
      option2: 'is',
      option3: 'am',
      option4: 'was',
      correctAnswer: '1',
      explanation: 'my parents는 복수이므로 are를 사용합니다.',
      tags: 'be동사,중1영어',
      isActive: true,
    },

    // LEVEL_5 - 최고난이도
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_5' as const,
      questionText: 'Not only Tom but also I ___ ready.',
      option1: 'am',
      option2: 'is',
      option3: 'are',
      option4: 'be',
      correctAnswer: '1',
      explanation: 'not only A but also B 구문에서 동사는 B(I)에 수를 일치시킵니다.',
      tags: 'be동사,상관접속사,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_5' as const,
      questionText: 'Either you or he ___ wrong.',
      option1: 'is',
      option2: 'are',
      option3: 'am',
      option4: 'be',
      correctAnswer: '1',
      explanation: 'either A or B 구문에서 동사는 B(he)에 수를 일치시킵니다.',
      tags: 'be동사,상관접속사,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_5' as const,
      questionText: 'The number of students ___ 30.',
      option1: 'is',
      option2: 'are',
      option3: 'am',
      option4: 'be',
      correctAnswer: '1',
      explanation: 'the number of는 단수 취급하므로 is를 사용합니다.',
      tags: 'be동사,수일치,중1영어',
      isActive: true,
    },
  );

  // 중1 - 일반동사 (chapters[1])
  const chapter2 = chapters[1];
  realProblems.push(
    // LEVEL_1
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: 'I ___ English every day.',
      option1: 'study',
      option2: 'studies',
      option3: 'studying',
      option4: 'studied',
      correctAnswer: '1',
      explanation: '주어가 I일 때 동사 원형을 사용합니다.',
      tags: '일반동사,현재형,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: 'She ___ to school by bus.',
      option1: 'goes',
      option2: 'go',
      option3: 'going',
      option4: 'went',
      correctAnswer: '1',
      explanation: '주어가 3인칭 단수(she)일 때 동사에 -es를 붙입니다.',
      tags: '일반동사,3인칭단수,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: 'They ___ soccer after school.',
      option1: 'play',
      option2: 'plays',
      option3: 'playing',
      option4: 'played',
      correctAnswer: '1',
      explanation: '주어가 복수(they)일 때 동사 원형을 사용합니다.',
      tags: '일반동사,현재형,중1영어',
      isActive: true,
    },

    // LEVEL_2
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: 'He ___ his homework every night.',
      option1: 'does',
      option2: 'do',
      option3: 'doing',
      option4: 'did',
      correctAnswer: '1',
      explanation: '3인칭 단수 현재형에서 do는 does로 변합니다.',
      tags: '일반동사,3인칭단수,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: 'I ___ not like coffee.',
      option1: 'do',
      option2: 'does',
      option3: 'am',
      option4: 'is',
      correctAnswer: '1',
      explanation: '일반동사 부정문은 do not을 사용합니다.',
      tags: '일반동사,부정문,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: '___ you play the piano?',
      option1: 'Do',
      option2: 'Does',
      option3: 'Are',
      option4: 'Is',
      correctAnswer: '1',
      explanation: '일반동사 의문문은 Do로 시작합니다.',
      tags: '일반동사,의문문,중1영어',
      isActive: true,
    },

    // LEVEL_3
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: 'She ___ not watch TV on weekdays.',
      option1: 'does',
      option2: 'do',
      option3: 'is',
      option4: 'are',
      correctAnswer: '1',
      explanation: '3인칭 단수 부정문은 does not을 사용합니다.',
      tags: '일반동사,부정문,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: '___ he speak English well?',
      option1: 'Does',
      option2: 'Do',
      option3: 'Is',
      option4: 'Are',
      correctAnswer: '1',
      explanation: '3인칭 단수 의문문은 Does로 시작합니다.',
      tags: '일반동사,의문문,중1영어',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: 'My brother ___ breakfast at 7 a.m.',
      option1: 'has',
      option2: 'have',
      option3: 'having',
      option4: 'had',
      correctAnswer: '1',
      explanation: '3인칭 단수 현재형에서 have는 has로 변합니다.',
      tags: '일반동사,3인칭단수,중1영어',
      isActive: true,
    },

    // LEVEL_4 - LEVEL_5 추가...
  );

  console.log('✅ Real English Problems prepared:', realProblems.length);

  const problems = await db
    .insert(schema.englishProblems)
    .values(realProblems)
    .returning();

  console.log('✅ Real English Problems inserted:', problems.length);

  await pool.end();
  console.log('🎉 Real English seed completed!');
}

seedEnglishReal().catch(console.error);
