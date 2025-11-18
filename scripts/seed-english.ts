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
      category: subCategories[1], // 인사와 소개 > 듣기 (스크립트형)
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: 'What greeting did they use?',
          options: ['Good morning', 'Hi there', 'Hello', 'Hey'],
          correctAnswer: 'Hello',
          explanation: 'Sarah clearly says "Hello" at the beginning.',
          scriptData: {
            characters: [
              { role: 'Sarah', avatar: 'Sarah', gender: 'female' as const },
              { role: 'Brandon', avatar: 'Brandon', gender: 'male' as const },
            ],
            dialogues: [
              { speaker: 'Sarah', text: 'Hello! Nice to meet you.' },
              { speaker: 'Brandon', text: 'Hi! Nice to meet you too.' },
              { speaker: 'Sarah', text: "I'm Sarah. What's your name?" },
              { speaker: 'Brandon', text: "I'm Brandon." },
            ],
          },
        },
        {
          difficulty: 'LEVEL_2',
          questionText: 'How did Sarah introduce herself?',
          options: ['My name is...', "I'm...", 'Call me...', 'This is...'],
          correctAnswer: "I'm...",
          explanation: 'Sarah said "I\'m Sarah".',
          scriptData: {
            characters: [
              { role: 'Sarah', avatar: 'Sarah', gender: 'female' as const },
              { role: 'Brandon', avatar: 'Brandon', gender: 'male' as const },
            ],
            dialogues: [
              { speaker: 'Sarah', text: 'Hello! Nice to meet you.' },
              { speaker: 'Brandon', text: 'Hi! Nice to meet you too.' },
              { speaker: 'Sarah', text: "I'm Sarah. What's your name?" },
              { speaker: 'Brandon', text: "I'm Brandon." },
            ],
          },
        },
        {
          difficulty: 'LEVEL_3',
          questionText: 'How old is Katie?',
          options: ['13', '15', '16', '14'],
          correctAnswer: '14',
          explanation: 'Katie mentions she is 14 years old.',
          scriptData: {
            characters: [
              { role: 'Katie', avatar: 'Katie', gender: 'female' as const },
              { role: 'Ronald', avatar: 'Ronald', gender: 'male' as const },
            ],
            dialogues: [
              { speaker: 'Ronald', text: 'Hi Katie! How old are you?' },
              { speaker: 'Katie', text: "I'm 14 years old. How about you?" },
              { speaker: 'Ronald', text: "I'm 15. We're almost the same age!" },
              { speaker: 'Katie', text: 'Yes, we are!' },
            ],
          },
        },
        {
          difficulty: 'LEVEL_4',
          questionText: 'What hobby does Elizabeth mention?',
          options: ['Swimming', 'Reading', 'Drawing', 'Singing'],
          correctAnswer: 'Reading',
          explanation: 'Elizabeth says she loves reading books.',
          scriptData: {
            characters: [
              {
                role: 'Elizabeth',
                avatar: 'Elizabeth',
                gender: 'female' as const,
              },
              { role: 'Zack', avatar: 'Zack', gender: 'male' as const },
            ],
            dialogues: [
              {
                speaker: 'Zack',
                text: 'What do you like to do in your free time?',
              },
              {
                speaker: 'Elizabeth',
                text: 'I love reading books. How about you?',
              },
              { speaker: 'Zack', text: 'I enjoy playing video games.' },
              { speaker: 'Elizabeth', text: 'That sounds fun!' },
            ],
          },
        },
        {
          difficulty: 'LEVEL_5',
          questionText: 'What is the relationship between Sophie and Hugo?',
          options: ['Siblings', 'Neighbors', 'Strangers', 'Classmates'],
          correctAnswer: 'Classmates',
          explanation: 'They mention being in the same class.',
          scriptData: {
            characters: [
              { role: 'Sophie', avatar: 'Sophie', gender: 'female' as const },
              { role: 'Hugo', avatar: 'Hugo', gender: 'male' as const },
            ],
            dialogues: [
              {
                speaker: 'Sophie',
                text: "Hi! Are you in Mr. Kim's class too?",
              },
              { speaker: 'Hugo', text: 'Yes, I am! I sit in the back row.' },
              { speaker: 'Sophie', text: "Nice to meet you! I'm Sophie." },
              { speaker: 'Hugo', text: "I'm Hugo. Welcome to our class!" },
            ],
          },
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
      category: subCategories[3], // 일상생활 > 듣기 (스크립트형)
      questions: [
        {
          difficulty: 'LEVEL_1',
          questionText: 'What day is it?',
          options: ['Tuesday', 'Monday', 'Wednesday', 'Thursday'],
          correctAnswer: 'Monday',
          explanation: 'Kira says "Today is Monday".',
          scriptData: {
            characters: [
              { role: 'Kira', avatar: 'Kira', gender: 'female' as const },
              { role: 'Asher', avatar: 'Asher', gender: 'male' as const },
            ],
            dialogues: [
              { speaker: 'Kira', text: 'Good morning! Today is Monday.' },
              { speaker: 'Asher', text: 'Yes, a new week begins!' },
              { speaker: 'Kira', text: 'Are you ready for school?' },
              { speaker: 'Asher', text: "Yes, let's go!" },
            ],
          },
        },
        {
          difficulty: 'LEVEL_2',
          questionText: 'What subject does Sierra have first?',
          options: ['English', 'Science', 'Math', 'History'],
          correctAnswer: 'Math',
          explanation: 'Sierra mentions Math is her first class.',
          scriptData: {
            characters: [
              { role: 'Sierra', avatar: 'Sierra', gender: 'female' as const },
              { role: 'Clarence', avatar: 'Clarence', gender: 'male' as const },
            ],
            dialogues: [
              { speaker: 'Clarence', text: 'What class do you have first?' },
              { speaker: 'Sierra', text: 'I have Math first. What about you?' },
              { speaker: 'Clarence', text: 'I have English first.' },
              { speaker: 'Sierra', text: 'See you at lunch then!' },
            ],
          },
        },
        {
          difficulty: 'LEVEL_3',
          questionText: 'Where do they have lunch?',
          options: ['Classroom', 'Home', 'Restaurant', 'Cafeteria'],
          correctAnswer: 'Cafeteria',
          explanation: 'They agree to meet at the cafeteria.',
          scriptData: {
            characters: [
              { role: 'Katie', avatar: 'Katie', gender: 'female' as const },
              { role: 'Brandon', avatar: 'Brandon', gender: 'male' as const },
            ],
            dialogues: [
              { speaker: 'Katie', text: 'Where should we have lunch?' },
              { speaker: 'Brandon', text: "Let's go to the cafeteria." },
              {
                speaker: 'Katie',
                text: 'Sounds good! I heard they have pizza today.',
              },
              { speaker: 'Brandon', text: 'Great! I love pizza!' },
            ],
          },
        },
        {
          difficulty: 'LEVEL_4',
          questionText: 'What does Sarah plan to do this weekend?',
          options: ['Study', 'Visit family', 'Go shopping', 'Watch a movie'],
          correctAnswer: 'Watch a movie',
          explanation: 'Sarah mentions watching a new movie.',
          scriptData: {
            characters: [
              { role: 'Sarah', avatar: 'Sarah', gender: 'female' as const },
              { role: 'Ronald', avatar: 'Ronald', gender: 'male' as const },
            ],
            dialogues: [
              { speaker: 'Ronald', text: 'Any plans for the weekend?' },
              { speaker: 'Sarah', text: "I'm going to watch a new movie." },
              { speaker: 'Ronald', text: 'Which one?' },
              {
                speaker: 'Sarah',
                text: 'The new superhero movie. It looks exciting!',
              },
            ],
          },
        },
        {
          difficulty: 'LEVEL_5',
          questionText: 'How does Elizabeth feel about her daily routine?',
          options: ['Bored', 'Satisfied', 'Stressed', 'Excited'],
          correctAnswer: 'Satisfied',
          explanation: 'Elizabeth expresses satisfaction with her routine.',
          scriptData: {
            characters: [
              {
                role: 'Elizabeth',
                avatar: 'Elizabeth',
                gender: 'female' as const,
              },
              { role: 'Hugo', avatar: 'Hugo', gender: 'male' as const },
            ],
            dialogues: [
              {
                speaker: 'Hugo',
                text: 'How do you feel about your daily schedule?',
              },
              { speaker: 'Elizabeth', text: "I'm quite satisfied with it." },
              { speaker: 'Hugo', text: "That's good! Balance is important." },
              {
                speaker: 'Elizabeth',
                text: 'Yes, I have time for both study and hobbies.',
              },
            ],
          },
        },
      ],
    },
  ];

  questionSets.forEach((set) => {
    set.questions.forEach((q: any, index) => {
      questionsData.push({
        categoryId: set.category.id,
        creatorType: 'SYSTEM' as const,
        passage: set.passage || null, // 독해 지문 추가
        scriptData: q.scriptData || null, // 스크립트 데이터 (jsonb이므로 객체 그대로)
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
