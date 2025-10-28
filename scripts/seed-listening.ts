import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { listeningQuestions } from '../src/drizzle/schema-listening';

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'user',
  password: 'password',
  database: 'problem-bank',
});

const db = drizzle(pool);

async function seed() {
  console.log('🌱 Seeding listening questions...');

  await db.insert(listeningQuestions).values([
    {
      subject: '영어',
      questionText: '다음 대화를 듣고 주문한 음식을 고르시오',
      listeningType: 'script',
      script: {
        title: '레스토랑 주문',
        messages: [
          {
            role: 'USER',
            message: 'I would like to order a large pizza with pepperoni.',
          },
          {
            role: 'CHATBOT',
            message: 'Okay, one large pepperoni pizza. Anything else?',
          },
          { role: 'USER', message: 'No, that is all. Thank you!' },
        ],
      },
      choices: [
        'Small pizza',
        'Medium pizza',
        'Large pizza',
        'Extra large pizza',
      ],
      correctAnswer: 'C',
      difficulty: 2,
    },
    {
      subject: '영어',
      questionText: '다음 대화를 듣고 어디에서 만날지 고르시오',
      listeningType: 'script',
      script: {
        title: '약속 장소',
        messages: [
          { role: 'USER', message: 'Where should we meet tomorrow?' },
          {
            role: 'CHATBOT',
            message: 'How about the coffee shop near the library?',
          },
          { role: 'USER', message: 'Sounds good! See you at 3 PM.' },
        ],
      },
      choices: [
        'At the library',
        'At the coffee shop',
        'At the park',
        'At the school',
      ],
      correctAnswer: 'B',
      difficulty: 1,
    },
    {
      subject: '영어',
      questionText: '다음 대화를 듣고 남자가 구매할 물건을 고르시오',
      listeningType: 'script',
      script: {
        title: '쇼핑',
        messages: [
          { role: 'CHATBOT', message: 'Can I help you find something?' },
          {
            role: 'USER',
            message: "Yes, I'm looking for a new laptop.",
          },
          {
            role: 'CHATBOT',
            message: 'We have several models. What is your budget?',
          },
          { role: 'USER', message: 'Around 1000 dollars.' },
        ],
      },
      choices: ['A phone', 'A laptop', 'A tablet', 'A camera'],
      correctAnswer: 'B',
      difficulty: 2,
    },
    {
      subject: '영어',
      questionText: '다음 대화를 듣고 여자의 직업을 고르시오',
      listeningType: 'script',
      script: {
        title: '직업 소개',
        messages: [
          { role: 'USER', message: 'What do you do for a living?' },
          {
            role: 'CHATBOT',
            message: 'I teach English at a high school.',
          },
          { role: 'USER', message: 'That sounds interesting!' },
          {
            role: 'CHATBOT',
            message: 'Yes, I really enjoy working with students.',
          },
        ],
      },
      choices: ['Doctor', 'Teacher', 'Engineer', 'Lawyer'],
      correctAnswer: 'B',
      difficulty: 1,
    },
    {
      subject: '영어',
      questionText: '다음 대화를 듣고 날씨가 어떤지 고르시오',
      listeningType: 'script',
      script: {
        title: '날씨 대화',
        messages: [
          { role: 'USER', message: 'How is the weather today?' },
          {
            role: 'CHATBOT',
            message: "It's raining heavily. Don't forget your umbrella!",
          },
          { role: 'USER', message: 'Thanks for reminding me!' },
        ],
      },
      choices: ['Sunny', 'Rainy', 'Snowy', 'Cloudy'],
      correctAnswer: 'B',
      difficulty: 1,
    },
  ]);

  console.log('✅ Seeding complete! Added 5 listening questions.');
  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
