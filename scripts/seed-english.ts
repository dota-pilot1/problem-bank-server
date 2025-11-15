import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-tree';

async function seedEnglish() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting English seed (categories table)...');

  // 1. 최상위 단원 생성 (2개)
  const topCategories = (await db
    .insert(schema.categories)
    .values([
      {
        name: '인사와 소개',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        orderIndex: 1,
        parentId: null,
      },
      {
        name: '일상생활',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        orderIndex: 2,
        parentId: null,
      },
    ])
    .returning()) as any[];

  console.log('✅ Top categories created:', topCategories.length);

  // 2. 각 단원 하위에 독해/듣기 카테고리 생성
  const subCategories = (await db
    .insert(schema.categories)
    .values([
      {
        name: '독해',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        parentId: topCategories[0].id,
        orderIndex: 1,
      },
      {
        name: '듣기',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        parentId: topCategories[0].id,
        orderIndex: 2,
      },
      {
        name: '독해',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        parentId: topCategories[1].id,
        orderIndex: 1,
      },
      {
        name: '듣기',
        subject: 'ENGLISH',
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
      category: subCategories[0], // 인사와 소개 > 독해
      passage: `Hello! My name is John. I am from New York. I am a student at Lincoln High School. I have two siblings - an older sister and a younger brother. I love playing basketball and reading books. Nice to meet you!`,
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: "What is the person's name?",
          options: ['John', 'Mike', 'Sarah', 'Emily'],
          correctAnswer: 'John',
          explanation: 'The passage clearly states "My name is John".',
        },
        {
          difficulty: 'LEVEL_2',
          questionText: 'Where is the speaker from?',
          options: ['New York', 'London', 'Seoul', 'Tokyo'],
          correctAnswer: 'New York',
          explanation: 'The text mentions "I am from New York".',
        },
        {
          difficulty: 'LEVEL_3',
          questionText: 'What does the person do?',
          options: ['Teacher', 'Student', 'Engineer', 'Doctor'],
          correctAnswer: 'Student',
          explanation: 'The passage indicates they are a student.',
        },
        {
          difficulty: 'LEVEL_4',
          questionText: 'How many siblings does the speaker have?',
          options: ['None', 'One', 'Two', 'Three'],
          correctAnswer: 'Two',
          explanation: 'The text states "I have two siblings".',
        },
        {
          difficulty: 'LEVEL_5',
          questionText: "What can we infer about the speaker's personality?",
          options: ['Outgoing', 'Shy', 'Serious', 'Lazy'],
          correctAnswer: 'Outgoing',
          explanation:
            "The speaker's friendly introduction suggests an outgoing personality.",
        },
      ],
    },
    {
      category: subCategories[1], // 인사와 소개 > 듣기
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: 'What greeting did they use?',
          options: ['Hello', 'Good morning', 'Hi there', 'Hey'],
          correctAnswer: 'Hello',
          explanation: 'The audio clearly says "Hello".',
        },
        {
          difficulty: 'LEVEL_2',
          questionText: 'How did the person introduce themselves?',
          options: ["I'm...", 'My name is...', 'Call me...', 'This is...'],
          correctAnswer: 'My name is...',
          explanation: 'They said "My name is...".',
        },
        {
          difficulty: 'LEVEL_3',
          questionText: "What is the speaker's age?",
          options: ['13', '14', '15', '16'],
          correctAnswer: '14',
          explanation: 'The speaker mentions being 14 years old.',
        },
        {
          difficulty: 'LEVEL_4',
          questionText: 'What hobby does the speaker mention?',
          options: ['Reading', 'Swimming', 'Drawing', 'Singing'],
          correctAnswer: 'Reading',
          explanation: 'The speaker says they enjoy reading.',
        },
        {
          difficulty: 'LEVEL_5',
          questionText: 'What tone does the speaker use?',
          options: ['Formal', 'Casual', 'Nervous', 'Excited'],
          correctAnswer: 'Casual',
          explanation: 'The speaker uses a friendly, casual tone.',
        },
      ],
    },
    {
      category: subCategories[2], // 일상생활 > 독해
      passage: `My Daily Routine\n\nI wake up at 7:00 every morning. I have toast and orange juice for breakfast. School starts at 8:30, so I take the bus at 8:00. After school, I have soccer practice for two hours. I get home around 6:00 PM, have dinner with my family, and do my homework. I usually go to bed at 10:30 PM.`,
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: 'What time does school start?',
          options: ['8:00', '8:30', '9:00', '9:30'],
          correctAnswer: '8:30',
          explanation: 'The text states school starts at 8:30.',
        },
        {
          difficulty: 'LEVEL_2',
          questionText: 'What does the person eat for breakfast?',
          options: ['Toast', 'Cereal', 'Rice', 'Eggs'],
          correctAnswer: 'Toast',
          explanation: 'The passage mentions eating toast.',
        },
        {
          difficulty: 'LEVEL_3',
          questionText: 'How does the person get to school?',
          options: ['By bus', 'By subway', 'By bike', 'On foot'],
          correctAnswer: 'By bus',
          explanation: 'The text indicates they take the bus.',
        },
        {
          difficulty: 'LEVEL_4',
          questionText: 'What activity does the person do after school?',
          options: [
            'Soccer practice',
            'Piano lesson',
            'Study group',
            'Part-time job',
          ],
          correctAnswer: 'Soccer practice',
          explanation: 'The passage describes soccer practice after school.',
        },
        {
          difficulty: 'LEVEL_5',
          questionText:
            "What can be inferred about the person's daily routine?",
          options: ['Very busy', 'Relaxed', 'Inconsistent', 'Unplanned'],
          correctAnswer: 'Very busy',
          explanation: 'The schedule described shows a busy daily routine.',
        },
      ],
    },
    {
      category: subCategories[3], // 일상생활 > 듣기
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: 'What day is it?',
          options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          correctAnswer: 'Monday',
          explanation: "The speaker mentions it's Monday.",
        },
        {
          difficulty: 'LEVEL_2',
          questionText: 'What subject does the person have first?',
          options: ['Math', 'English', 'Science', 'History'],
          correctAnswer: 'Math',
          explanation: 'The audio indicates Math is the first class.',
        },
        {
          difficulty: 'LEVEL_3',
          questionText: 'Where does the person have lunch?',
          options: ['Cafeteria', 'Classroom', 'Home', 'Restaurant'],
          correctAnswer: 'Cafeteria',
          explanation: 'The speaker says they eat in the cafeteria.',
        },
        {
          difficulty: 'LEVEL_4',
          questionText: 'What does the person plan to do this weekend?',
          options: ['Study', 'Visit family', 'Go shopping', 'Watch a movie'],
          correctAnswer: 'Watch a movie',
          explanation: 'They mention plans to watch a movie.',
        },
        {
          difficulty: 'LEVEL_5',
          questionText:
            'What emotion does the speaker convey about their routine?',
          options: ['Satisfaction', 'Boredom', 'Stress', 'Excitement'],
          correctAnswer: 'Satisfaction',
          explanation:
            "The speaker's tone suggests satisfaction with their routine.",
        },
      ],
    },
  ];

  questionSets.forEach((set) => {
    set.questions.forEach((q, index) => {
      questionsData.push({
        categoryId: set.category.id,
        creatorType: 'SYSTEM' as const,
        passage: set.passage || null, // 독해 지문 추가
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        tags: `${set.category.name},영어`,
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
  console.log('🎉 English seed completed!');
  console.log('📊 Summary:');
  console.log('  - 2 top categories: 인사와 소개, 일상생활');
  console.log('  - 4 sub categories: 각 단원별 독해/듣기');
  console.log('  - 20 questions: 각 카테고리별 5문제');
}

seedEnglish().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
