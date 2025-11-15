import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-tree';

async function seedMath() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting Math seed (categories table)...');

  // 1. 최상위 단원 생성 (2개)
  const topCategories = (await db
    .insert(schema.categories)
    .values([
      {
        name: '정수와 유리수',
        subject: 'MATH',
        creatorType: 'SYSTEM',
        orderIndex: 1,
        parentId: null,
      },
      {
        name: '일차방정식',
        subject: 'MATH',
        creatorType: 'SYSTEM',
        orderIndex: 2,
        parentId: null,
      },
    ])
    .returning()) as any[];

  console.log('✅ Top categories created:', topCategories.length);

  // 2. 각 단원 하위에 기초/응용 카테고리 생성
  const subCategories = (await db
    .insert(schema.categories)
    .values([
      {
        name: '기초',
        subject: 'MATH',
        creatorType: 'SYSTEM',
        parentId: topCategories[0].id,
        orderIndex: 1,
      },
      {
        name: '응용',
        subject: 'MATH',
        creatorType: 'SYSTEM',
        parentId: topCategories[0].id,
        orderIndex: 2,
      },
      {
        name: '기초',
        subject: 'MATH',
        creatorType: 'SYSTEM',
        parentId: topCategories[1].id,
        orderIndex: 1,
      },
      {
        name: '응용',
        subject: 'MATH',
        creatorType: 'SYSTEM',
        parentId: topCategories[1].id,
        orderIndex: 2,
      },
    ])
    .returning()) as any[];

  console.log('✅ Sub categories created:', subCategories.length);

  // 3. 문제 생성 (각 카테고리당 5문제)
  const questionsData: any[] = [];

  const questionSets = [
    {
      category: subCategories[0], // 정수와 유리수 > 기초
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: '(-3) + 5 = ?',
          options: ['2', '-2', '8', '-8'],
          correctAnswer: '2',
          explanation: '음수 -3에 양수 5를 더하면 2입니다.',
        },
        {
          difficulty: 'LEVEL_2',
          questionText: '(-4) × 3 = ?',
          options: ['-12', '12', '-7', '7'],
          correctAnswer: '-12',
          explanation: '음수와 양수를 곱하면 음수가 됩니다.',
        },
        {
          difficulty: 'LEVEL_3',
          questionText: '8 ÷ (-2) = ?',
          options: ['-4', '4', '-6', '6'],
          correctAnswer: '-4',
          explanation: '양수를 음수로 나누면 음수가 됩니다.',
        },
        {
          difficulty: 'LEVEL_4',
          questionText: '(-2) × (-3) × 4 = ?',
          options: ['24', '-24', '12', '-12'],
          correctAnswer: '24',
          explanation: '음수끼리 곱하면 양수, 양수를 곱하면 양수입니다.',
        },
        {
          difficulty: 'LEVEL_5',
          questionText: '(-15) ÷ 3 + 8 = ?',
          options: ['3', '-3', '13', '-13'],
          correctAnswer: '3',
          explanation: '-15 ÷ 3 = -5, -5 + 8 = 3입니다.',
        },
      ],
    },
    {
      category: subCategories[1], // 정수와 유리수 > 응용
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: '1/2 + 1/4 = ?',
          options: ['1/6', '2/6', '3/4', '1/3'],
          correctAnswer: '3/4',
          explanation: '1/2 = 2/4이므로 2/4 + 1/4 = 3/4입니다.',
        },
        {
          difficulty: 'LEVEL_2',
          questionText: '2/3 × 3/4 = ?',
          options: ['1/2', '5/7', '6/12', '2/4'],
          correctAnswer: '1/2',
          explanation: '(2×3)/(3×4) = 6/12 = 1/2입니다.',
        },
        {
          difficulty: 'LEVEL_3',
          questionText: '5/6 ÷ 2/3 = ?',
          options: ['5/4', '10/18', '5/9', '15/12'],
          correctAnswer: '5/4',
          explanation: '5/6 × 3/2 = 15/12 = 5/4입니다.',
        },
        {
          difficulty: 'LEVEL_4',
          questionText: '(-1/2) + 3/4 = ?',
          options: ['1/4', '-1/4', '5/4', '-5/4'],
          correctAnswer: '1/4',
          explanation: '-2/4 + 3/4 = 1/4입니다.',
        },
        {
          difficulty: 'LEVEL_5',
          questionText: '(2/3 - 1/2) × 6 = ?',
          options: ['1', '2', '3', '4'],
          correctAnswer: '1',
          explanation: '(4/6 - 3/6) × 6 = 1/6 × 6 = 1입니다.',
        },
      ],
    },
    {
      category: subCategories[2], // 일차방정식 > 기초
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: 'x + 3 = 7일 때, x의 값은?',
          options: ['3', '4', '5', '10'],
          correctAnswer: '4',
          explanation: 'x = 7 - 3 = 4입니다.',
        },
        {
          difficulty: 'LEVEL_2',
          questionText: '2x = 10일 때, x의 값은?',
          options: ['3', '4', '5', '6'],
          correctAnswer: '5',
          explanation: 'x = 10 ÷ 2 = 5입니다.',
        },
        {
          difficulty: 'LEVEL_3',
          questionText: '3x - 5 = 10일 때, x의 값은?',
          options: ['3', '4', '5', '6'],
          correctAnswer: '5',
          explanation: '3x = 15이므로 x = 5입니다.',
        },
        {
          difficulty: 'LEVEL_4',
          questionText: '5x + 2 = 3x + 10일 때, x의 값은?',
          options: ['2', '3', '4', '5'],
          correctAnswer: '4',
          explanation: '2x = 8이므로 x = 4입니다.',
        },
        {
          difficulty: 'LEVEL_5',
          questionText: '2(x + 3) = 14일 때, x의 값은?',
          options: ['2', '3', '4', '5'],
          correctAnswer: '4',
          explanation: '2x + 6 = 14, 2x = 8, x = 4입니다.',
        },
      ],
    },
    {
      category: subCategories[3], // 일차방정식 > 응용
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: '어떤 수의 3배에 4를 더하면 19가 된다. 이 수는?',
          options: ['3', '4', '5', '6'],
          correctAnswer: '5',
          explanation: '3x + 4 = 19, 3x = 15, x = 5입니다.',
        },
        {
          difficulty: 'LEVEL_2',
          questionText: '연속하는 두 정수의 합이 15일 때, 작은 수는?',
          options: ['6', '7', '8', '9'],
          correctAnswer: '7',
          explanation: 'x + (x+1) = 15, 2x = 14, x = 7입니다.',
        },
        {
          difficulty: 'LEVEL_3',
          questionText:
            '형의 나이가 동생의 2배이고, 두 사람 나이의 합이 30살이다. 동생의 나이는?',
          options: ['8살', '10살', '12살', '15살'],
          correctAnswer: '10살',
          explanation: 'x + 2x = 30, 3x = 30, x = 10입니다.',
        },
        {
          difficulty: 'LEVEL_4',
          questionText:
            '현재 사탕이 50개 있다. 하루에 3개씩 먹으면 며칠 후에 8개가 남는가?',
          options: ['12일', '13일', '14일', '15일'],
          correctAnswer: '14일',
          explanation: '50 - 3x = 8, 3x = 42, x = 14입니다.',
        },
        {
          difficulty: 'LEVEL_5',
          questionText: '정가의 20% 할인한 가격이 8000원이다. 정가는?',
          options: ['9000원', '9600원', '10000원', '12000원'],
          correctAnswer: '10000원',
          explanation: '0.8x = 8000, x = 10000입니다.',
        },
      ],
    },
  ];

  questionSets.forEach((set) => {
    set.questions.forEach((q, index) => {
      questionsData.push({
        categoryId: set.category.id,
        creatorType: 'SYSTEM' as const,
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        tags: `${set.category.name},수학`,
        isActive: true,
        orderIndex: index + 1,
      });
    });
  });

  const questions = await db
    .insert(schema.questions)
    .values(questionsData)
    .returning();

  console.log('✅ Questions created:', questions.length);

  await pool.end();
  console.log('🎉 Math seed completed!');
  console.log('📊 Summary:');
  console.log('  - 2 top categories: 정수와 유리수, 일차방정식');
  console.log('  - 4 sub categories: 각 단원별 기초/응용');
  console.log('  - 20 questions: 각 카테고리별 5문제');
}

seedMath().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
