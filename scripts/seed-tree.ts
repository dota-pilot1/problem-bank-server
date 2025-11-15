import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-tree';

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'user',
  password: 'password',
  database: 'problem-bank',
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('🌱 Starting tree structure seed...\n');

  try {
    // 1. 영어 루트 카테고리 생성
    console.log('📚 Creating English categories...');
    const englishRootResult = await db
      .insert(schema.categories)
      .values({
        name: '영어',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        orderIndex: 1,
        description: '영어 공식 문제 은행',
      })
      .returning();
    const englishRoot = englishRootResult[0];

    // 2. 영어 > 중1
    const middle1EnglishResult = await db
      .insert(schema.categories)
      .values({
        parentId: englishRoot.id,
        name: '중1',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        orderIndex: 1,
      })
      .returning();
    const middle1English = middle1EnglishResult[0];

    // 3. 영어 > 중1 > 1단원
    const chapter1Result = await db
      .insert(schema.categories)
      .values({
        parentId: middle1English.id,
        name: '1단원 - 인사와 소개',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        orderIndex: 1,
        description: 'Greetings and Introductions',
      })
      .returning();
    const chapter1 = chapter1Result[0];

    // 4. 영어 > 중1 > 1단원 > 독해
    const readingCategoryResult = await db
      .insert(schema.categories)
      .values({
        parentId: chapter1.id,
        name: '독해',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        orderIndex: 1,
      })
      .returning();
    const readingCategory = readingCategoryResult[0];

    // 5. 영어 > 중1 > 1단원 > 듣기
    const listeningCategoryResult = await db
      .insert(schema.categories)
      .values({
        parentId: chapter1.id,
        name: '듣기',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        orderIndex: 2,
      })
      .returning();
    const listeningCategory = listeningCategoryResult[0];

    console.log('✅ English categories created\n');

    // 6. 독해 문제 추가
    console.log('📝 Creating reading questions...');
    await db.insert(schema.questions).values([
      {
        categoryId: readingCategory.id,
        creatorType: 'SYSTEM',
        title: 'Emily의 아침 산책',
        passage: `Emily has recently started a new habit: walking for 30 minutes every morning. At first, she found it difficult to wake up early, but after a few weeks, she began to enjoy the quiet streets and cool air. Walking not only helps her stay healthy but also gives her time to organize her thoughts before school.

Now, she feels upset when she misses her morning walk because it has become an important part of her day.`,
        questionText:
          'What is the main reason Emily continues her morning walk?',
        options: [
          'Because she wants to win a walking competition.',
          'Because it helps her relax and prepare for the day.',
          'Because her parents force her to exercise every morning.',
          'Because she needs to walk to school every day.',
        ],
        correctAnswer: 'Because it helps her relax and prepare for the day.',
        explanation:
          '지문에서 "Walking not only helps her stay healthy but also gives her time to organize her thoughts before school"라고 언급되어 있습니다.',
        difficulty: 'EASY',
        tags: '독해, 일상생활, 습관',
        isActive: true,
        orderIndex: 1,
      },
      {
        categoryId: readingCategory.id,
        creatorType: 'SYSTEM',
        title: 'Tom의 여행',
        passage: `Last summer, Tom traveled to Jeju Island with his family. They stayed at a hotel near the beach and enjoyed swimming in the ocean. Tom especially loved trying local food like black pork and fresh seafood. On the last day, they visited Hallasan Mountain and took many beautiful photos.

Tom said it was the best vacation he ever had.`,
        questionText: 'What did Tom enjoy the most during his trip?',
        options: [
          'Swimming in the ocean',
          'Trying local food',
          'Visiting Hallasan Mountain',
          'Staying at the hotel',
        ],
        correctAnswer: 'Trying local food',
        explanation:
          '지문에서 "Tom especially loved trying local food"라고 명시되어 있습니다.',
        difficulty: 'EASY',
        tags: '독해, 여행, 제주도',
        isActive: true,
        orderIndex: 2,
      },
    ]);

    console.log('✅ Reading questions created\n');

    // 7. 채팅 스크립트 추가
    console.log('💬 Creating chat scripts...');
    const chatScript1Result = await db
      .insert(schema.chatScripts)
      .values({
        title: '카페에서 커피 주문하기',
        description: '카페에서 음료를 주문하는 상황 대화',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        displayOrder: 1,
        scriptData: {
          situation: '카페에서 손님이 커피를 주문하는 상황',
          roles: ['Customer', 'Barista'],
          messages: [
            {
              role: 'LEFT_CHARACTER',
              message: "Hi, I'd like to order a tall latte, please.",
            },
            {
              role: 'RIGHT_CHARACTER',
              message: 'Sure! Would you like that hot or iced?',
            },
            {
              role: 'LEFT_CHARACTER',
              message: 'Hot, please. And can I get an extra shot of espresso?',
            },
            {
              role: 'RIGHT_CHARACTER',
              message: "Of course. That'll be $5.50.",
            },
          ],
        },
      })
      .returning();
    const chatScript1 = chatScript1Result[0];

    const chatScript2Result = await db
      .insert(schema.chatScripts)
      .values({
        title: '길 안내하기',
        description: '관광객에게 길을 안내하는 대화',
        subject: 'ENGLISH',
        creatorType: 'SYSTEM',
        displayOrder: 2,
        scriptData: {
          situation: '거리에서 관광객이 길을 묻는 상황',
          roles: ['Tourist', 'Local'],
          messages: [
            {
              role: 'LEFT_CHARACTER',
              message: 'Excuse me, how can I get to the subway station?',
            },
            {
              role: 'RIGHT_CHARACTER',
              message: 'Go straight for two blocks, then turn left.',
            },
            { role: 'LEFT_CHARACTER', message: 'Is it far from here?' },
            {
              role: 'RIGHT_CHARACTER',
              message: "No, it's about a 5-minute walk.",
            },
            { role: 'LEFT_CHARACTER', message: 'Thank you so much!' },
          ],
        },
      })
      .returning();
    const chatScript2 = chatScript2Result[0];

    console.log('✅ Chat scripts created\n');

    // 8. 듣기 문제 추가 (채팅 스크립트 참조)
    console.log('🎧 Creating listening questions...');
    await db.insert(schema.questions).values([
      {
        categoryId: listeningCategory.id,
        chatScriptId: chatScript1.id,
        creatorType: 'SYSTEM',
        title: '카페 주문',
        questionText: 'What size coffee did the customer order?',
        options: ['Tall', 'Grande', 'Venti', 'Short'],
        correctAnswer: 'Tall',
        explanation: 'Customer가 "a tall latte"를 주문했습니다.',
        difficulty: 'EASY',
        tags: '듣기, 일상대화, 카페',
        isActive: true,
        orderIndex: 1,
      },
      {
        categoryId: listeningCategory.id,
        chatScriptId: chatScript2.id,
        creatorType: 'SYSTEM',
        title: '길 안내',
        questionText: 'How long does it take to walk to the subway station?',
        options: [
          'About 2 minutes',
          'About 5 minutes',
          'About 10 minutes',
          'About 15 minutes',
        ],
        correctAnswer: 'About 5 minutes',
        explanation: 'Local이 "it\'s about a 5-minute walk"라고 답했습니다.',
        difficulty: 'EASY',
        tags: '듣기, 길 안내, 교통',
        isActive: true,
        orderIndex: 2,
      },
    ]);

    console.log('✅ Listening questions created\n');

    // 8. 수학 루트 카테고리 생성
    console.log('🔢 Creating Math categories...');
    const mathRootResult = await db
      .insert(schema.categories)
      .values({
        name: '수학',
        subject: 'MATH',
        creatorType: 'SYSTEM',
        orderIndex: 1,
        description: '수학 공식 문제 은행',
      })
      .returning();
    const mathRoot = mathRootResult[0];

    // 9. 수학 > 중1
    const middle1MathResult = await db
      .insert(schema.categories)
      .values({
        parentId: mathRoot.id,
        name: '중1',
        subject: 'MATH',
        creatorType: 'SYSTEM',
        orderIndex: 1,
      })
      .returning();
    const middle1Math = middle1MathResult[0];

    // 10. 수학 > 중1 > 정수와 유리수
    const mathChapter1Result = await db
      .insert(schema.categories)
      .values({
        parentId: middle1Math.id,
        name: '정수와 유리수',
        subject: 'MATH',
        creatorType: 'SYSTEM',
        orderIndex: 1,
      })
      .returning();
    const mathChapter1 = mathChapter1Result[0];

    console.log('✅ Math categories created\n');

    // 11. 수학 문제 추가
    console.log('➕ Creating math questions...');
    await db.insert(schema.questions).values([
      {
        categoryId: mathChapter1.id,
        creatorType: 'SYSTEM',
        title: '정수의 덧셈',
        questionText: '(-3) + 5 = ?',
        options: ['2', '-2', '8', '-8'],
        correctAnswer: '2',
        explanation: '음수와 양수의 덧셈: (-3) + 5 = 2',
        difficulty: 'EASY',
        tags: '정수, 덧셈',
        isActive: true,
        orderIndex: 1,
      },
      {
        categoryId: mathChapter1.id,
        creatorType: 'SYSTEM',
        title: '정수의 곱셈',
        questionText: '(-4) × (-2) = ?',
        options: ['8', '-8', '6', '-6'],
        correctAnswer: '8',
        explanation: '음수 × 음수 = 양수이므로 (-4) × (-2) = 8',
        difficulty: 'EASY',
        tags: '정수, 곱셈',
        isActive: true,
        orderIndex: 2,
      },
    ]);

    console.log('✅ Math questions created\n');

    console.log('🎉 Seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   - English categories: 5');
    console.log('   - Chat scripts: 2');
    console.log('   - English questions: 4 (2 reading + 2 listening)');
    console.log('   - Math categories: 3');
    console.log('   - Math questions: 2');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
