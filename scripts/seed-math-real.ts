import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-math';

async function seedMathReal() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting Real Math seed...');

  // 1. Math Chapters 생성
  const chaptersData = [
    // 중1 (7단원)
    { gradeLevel: 1, name: '소인수분해', orderIndex: 1 },
    { gradeLevel: 1, name: '정수와 유리수', orderIndex: 2 },
    { gradeLevel: 1, name: '문자와 식', orderIndex: 3 },
    { gradeLevel: 1, name: '일차방정식', orderIndex: 4 },
    { gradeLevel: 1, name: '좌표평면과 그래프', orderIndex: 5 },
    { gradeLevel: 1, name: '통계', orderIndex: 6 },
    { gradeLevel: 1, name: '기본 도형', orderIndex: 7 },

    // 중2 (7단원)
    { gradeLevel: 2, name: '유리수와 순환소수', orderIndex: 1 },
    { gradeLevel: 2, name: '단항식의 계산', orderIndex: 2 },
    { gradeLevel: 2, name: '다항식의 계산', orderIndex: 3 },
    { gradeLevel: 2, name: '일차부등식', orderIndex: 4 },
    { gradeLevel: 2, name: '연립일차방정식', orderIndex: 5 },
    { gradeLevel: 2, name: '일차함수', orderIndex: 6 },
    { gradeLevel: 2, name: '확률', orderIndex: 7 },

    // 중3 (7단원)
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

  // 실제 수학 문제 데이터
  const realProblems: any[] = [];

  // 중1 - 소인수분해 (chapterId = chapters[0].id)
  const chapter1 = chapters[0]; // 소인수분해
  realProblems.push(
    // LEVEL_1 - 기초
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: '12를 소인수분해하면?',
      option1: '2² × 3',
      option2: '2 × 6',
      option3: '3 × 4',
      option4: '2 × 3²',
      correctAnswer: '1',
      explanation: '12 = 2 × 6 = 2 × 2 × 3 = 2² × 3',
      tags: '소인수분해,중1수학,기초',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: '18의 소인수는 무엇인가?',
      option1: '2, 3',
      option2: '2, 9',
      option3: '3, 6',
      option4: '2, 3, 6',
      correctAnswer: '1',
      explanation: '18 = 2 × 9 = 2 × 3 × 3 = 2 × 3². 소인수는 2와 3이다.',
      tags: '소인수분해,중1수학,기초',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: '24를 소인수분해한 결과는?',
      option1: '2³ × 3',
      option2: '2² × 6',
      option3: '2 × 12',
      option4: '3² × 2',
      correctAnswer: '1',
      explanation: '24 = 2 × 12 = 2 × 2 × 6 = 2 × 2 × 2 × 3 = 2³ × 3',
      tags: '소인수분해,중1수학,기초',
      isActive: true,
    },

    // LEVEL_2 - 중급
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: '72를 소인수분해하면?',
      option1: '2³ × 3²',
      option2: '2² × 3³',
      option3: '2⁴ × 3',
      option4: '2 × 3⁴',
      correctAnswer: '1',
      explanation: '72 = 8 × 9 = 2³ × 3²',
      tags: '소인수분해,중1수학,중급',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: '150을 소인수분해한 결과는?',
      option1: '2 × 3 × 5²',
      option2: '2² × 3 × 5',
      option3: '2 × 3² × 5',
      option4: '3 × 5³',
      correctAnswer: '1',
      explanation: '150 = 2 × 75 = 2 × 3 × 25 = 2 × 3 × 5²',
      tags: '소인수분해,중1수학,중급',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: '108의 소인수의 개수는?',
      option1: '2개',
      option2: '3개',
      option3: '4개',
      option4: '5개',
      correctAnswer: '1',
      explanation: '108 = 2² × 3³. 소인수는 2와 3으로 2개이다.',
      tags: '소인수분해,중1수학,중급',
      isActive: true,
    },

    // LEVEL_3 - 고급
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: '2⁴ × 3² × 5 를 자연수로 나타내면?',
      option1: '720',
      option2: '360',
      option3: '540',
      option4: '900',
      correctAnswer: '1',
      explanation: '2⁴ × 3² × 5 = 16 × 9 × 5 = 144 × 5 = 720',
      tags: '소인수분해,중1수학,고급',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: '두 수 36과 48의 최대공약수는?',
      option1: '12',
      option2: '6',
      option3: '24',
      option4: '18',
      correctAnswer: '1',
      explanation: '36 = 2² × 3², 48 = 2⁴ × 3. 최대공약수 = 2² × 3 = 12',
      tags: '소인수분해,최대공약수,중1수학,고급',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: '12와 18의 최소공배수는?',
      option1: '36',
      option2: '72',
      option3: '216',
      option4: '24',
      correctAnswer: '1',
      explanation: '12 = 2² × 3, 18 = 2 × 3². 최소공배수 = 2² × 3² = 36',
      tags: '소인수분해,최소공배수,중1수학,고급',
      isActive: true,
    },

    // LEVEL_4 - 심화
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_4' as const,
      questionText: '2ⁿ × 3² = 72일 때, n의 값은?',
      option1: '3',
      option2: '2',
      option3: '4',
      option4: '5',
      correctAnswer: '3',
      explanation: '72 = 2³ × 3²이므로 n = 3',
      tags: '소인수분해,중1수학,심화',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_4' as const,
      questionText: '세 수 24, 36, 60의 최대공약수는?',
      option1: '12',
      option2: '6',
      option3: '24',
      option4: '4',
      correctAnswer: '1',
      explanation:
        '24 = 2³ × 3, 36 = 2² × 3², 60 = 2² × 3 × 5. 최대공약수 = 2² × 3 = 12',
      tags: '소인수분해,최대공약수,중1수학,심화',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_4' as const,
      questionText:
        '어떤 수를 소인수분해하면 2² × 3 × a이고, 이 수가 36의 배수일 때, a의 최솟값은?',
      option1: '3',
      option2: '2',
      option3: '6',
      option4: '9',
      correctAnswer: '3',
      explanation:
        '36 = 2² × 3². 2² × 3 × a가 36의 배수가 되려면 3²이 포함되어야 하므로 a의 최솟값은 3',
      tags: '소인수분해,배수,중1수학,심화',
      isActive: true,
    },

    // LEVEL_5 - 최고난이도
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_5' as const,
      questionText: '2⁵ × 3³ × 5²의 약수의 개수는?',
      option1: '72개',
      option2: '60개',
      option3: '48개',
      option4: '36개',
      correctAnswer: '1',
      explanation: '약수의 개수 = (5+1) × (3+1) × (2+1) = 6 × 4 × 3 = 72개',
      tags: '소인수분해,약수,중1수학,최고난도',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_5' as const,
      questionText: '세 수 120, 180, 210의 최소공배수는?',
      option1: '2520',
      option2: '1260',
      option3: '3600',
      option4: '5040',
      correctAnswer: '2',
      explanation:
        '120 = 2³ × 3 × 5, 180 = 2² × 3² × 5, 210 = 2 × 3 × 5 × 7. 최소공배수 = 2³ × 3² × 5 × 7 = 1260',
      tags: '소인수분해,최소공배수,중1수학,최고난도',
      isActive: true,
    },
    {
      chapterId: chapter1.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_5' as const,
      questionText: '2ᵃ × 3ᵇ = 216일 때, a + b의 값은?',
      option1: '6',
      option2: '5',
      option3: '7',
      option4: '8',
      correctAnswer: '1',
      explanation: '216 = 2³ × 3³이므로 a = 3, b = 3. a + b = 6',
      tags: '소인수분해,중1수학,최고난도',
      isActive: true,
    },
  );

  // 중1 - 정수와 유리수 (chapters[1])
  const chapter2 = chapters[1];
  realProblems.push(
    // LEVEL_1
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: '(-3) + 5의 값은?',
      option1: '2',
      option2: '-2',
      option3: '8',
      option4: '-8',
      correctAnswer: '2',
      explanation: '음수와 양수의 덧셈: -3 + 5 = 2',
      tags: '정수,덧셈,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: '7 - 10의 값은?',
      option1: '-3',
      option2: '3',
      option3: '-17',
      option4: '17',
      correctAnswer: '1',
      explanation: '7 - 10 = 7 + (-10) = -3',
      tags: '정수,뺄셈,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: '(-4) × 3의 값은?',
      option1: '-12',
      option2: '12',
      option3: '-7',
      option4: '7',
      correctAnswer: '1',
      explanation: '음수와 양수의 곱셈: (-4) × 3 = -12',
      tags: '정수,곱셈,중1수학',
      isActive: true,
    },

    // LEVEL_2
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: '(-6) ÷ 2 의 값은?',
      option1: '-3',
      option2: '3',
      option3: '-4',
      option4: '4',
      correctAnswer: '1',
      explanation: '(-6) ÷ 2 = -3',
      tags: '정수,나눗셈,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: '(-2) × (-5)의 값은?',
      option1: '10',
      option2: '-10',
      option3: '7',
      option4: '-7',
      correctAnswer: '1',
      explanation: '음수 × 음수 = 양수. (-2) × (-5) = 10',
      tags: '정수,곱셈,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_2' as const,
      questionText: '1/2 + 1/3의 값은?',
      option1: '5/6',
      option2: '2/5',
      option3: '1/6',
      option4: '3/6',
      correctAnswer: '1',
      explanation: '1/2 + 1/3 = 3/6 + 2/6 = 5/6',
      tags: '유리수,분수덧셈,중1수학',
      isActive: true,
    },

    // LEVEL_3
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: '(-3) + 7 - 5의 값은?',
      option1: '-1',
      option2: '1',
      option3: '9',
      option4: '-9',
      correctAnswer: '1',
      explanation: '(-3) + 7 - 5 = 4 - 5 = -1',
      tags: '정수,사칙연산,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: '2/3 - 1/4의 값은?',
      option1: '5/12',
      option2: '1/12',
      option3: '7/12',
      option4: '1/7',
      correctAnswer: '1',
      explanation: '2/3 - 1/4 = 8/12 - 3/12 = 5/12',
      tags: '유리수,분수뺄셈,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_3' as const,
      questionText: '(-2)³의 값은?',
      option1: '-8',
      option2: '8',
      option3: '-6',
      option4: '6',
      correctAnswer: '1',
      explanation: '(-2)³ = (-2) × (-2) × (-2) = -8',
      tags: '정수,거듭제곱,중1수학',
      isActive: true,
    },

    // LEVEL_4
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_4' as const,
      questionText: '(-1) × 2 - 3 × (-4)의 값은?',
      option1: '10',
      option2: '-10',
      option3: '14',
      option4: '-14',
      correctAnswer: '1',
      explanation: '(-1) × 2 - 3 × (-4) = -2 - (-12) = -2 + 12 = 10',
      tags: '정수,사칙연산,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_4' as const,
      questionText: '2/5 × 3/4의 값은?',
      option1: '3/10',
      option2: '6/20',
      option3: '5/9',
      option4: '1/2',
      correctAnswer: '1',
      explanation: '2/5 × 3/4 = (2×3)/(5×4) = 6/20 = 3/10',
      tags: '유리수,분수곱셈,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_4' as const,
      questionText: '(-2)² + (-3)²의 값은?',
      option1: '13',
      option2: '-13',
      option3: '5',
      option4: '-5',
      correctAnswer: '1',
      explanation: '(-2)² + (-3)² = 4 + 9 = 13',
      tags: '정수,거듭제곱,중1수학',
      isActive: true,
    },

    // LEVEL_5
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_5' as const,
      questionText: '(-2)³ × 3 + 5 × (-4)의 값은?',
      option1: '-44',
      option2: '44',
      option3: '-20',
      option4: '20',
      correctAnswer: '1',
      explanation: '(-2)³ × 3 + 5 × (-4) = (-8) × 3 + (-20) = -24 - 20 = -44',
      tags: '정수,복합연산,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_5' as const,
      questionText: '(2/3 + 1/6) × 3의 값은?',
      option1: '5/2',
      option2: '3/2',
      option3: '7/2',
      option4: '1',
      correctAnswer: '1',
      explanation: '(2/3 + 1/6) × 3 = (4/6 + 1/6) × 3 = 5/6 × 3 = 15/6 = 5/2',
      tags: '유리수,복합연산,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter2.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_5' as const,
      questionText: '1 ÷ (1/2 - 1/3)의 값은?',
      option1: '6',
      option2: '3',
      option3: '12',
      option4: '1/6',
      correctAnswer: '1',
      explanation: '1 ÷ (1/2 - 1/3) = 1 ÷ (3/6 - 2/6) = 1 ÷ 1/6 = 6',
      tags: '유리수,나눗셈,중1수학',
      isActive: true,
    },
  );

  // 중1 - 문자와 식 (chapters[2])
  const chapter3 = chapters[2];
  realProblems.push(
    // LEVEL_1
    {
      chapterId: chapter3.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: '3x + 2x를 간단히 하면?',
      option1: '5x',
      option2: '6x',
      option3: '5x²',
      option4: 'x⁵',
      correctAnswer: '1',
      explanation: '동류항끼리 더하면 3x + 2x = 5x',
      tags: '문자와식,동류항,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter3.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: '7a - 3a의 값은?',
      option1: '4a',
      option2: '10a',
      option3: '4',
      option4: '10',
      correctAnswer: '1',
      explanation: '7a - 3a = 4a',
      tags: '문자와식,동류항,중1수학',
      isActive: true,
    },
    {
      chapterId: chapter3.id,
      questionType: 'MULTIPLE_CHOICE' as const,
      difficulty: 'LEVEL_1' as const,
      questionText: '2 × x를 간단히 나타내면?',
      option1: '2x',
      option2: 'x2',
      option3: '2 + x',
      option4: 'x/2',
      correctAnswer: '1',
      explanation: '2 × x = 2x (곱셈 기호 생략)',
      tags: '문자와식,기본,중1수학',
      isActive: true,
    },

    // LEVEL_2 - LEVEL_5 문제들도 비슷하게 추가...
  );

  console.log('✅ Real Math Problems prepared:', realProblems.length);

  const problems = await db
    .insert(schema.mathProblems)
    .values(realProblems)
    .returning();

  console.log('✅ Real Math Problems inserted:', problems.length);

  await pool.end();
  console.log('🎉 Real Math seed completed!');
}

seedMathReal().catch(console.error);
