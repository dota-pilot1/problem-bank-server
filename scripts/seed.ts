import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema';

async function seed() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting seed...');

  // 1. Subjects 생성
  const subjects = await db
    .insert(schema.subjects)
    .values([
      { name: '수학', description: '중학교 수학 문제은행' },
      { name: '영어', description: '중학교 영어 문제은행' },
    ])
    .returning();

  console.log('✅ Subjects created:', subjects.length);

  // 2. Grades 생성 (중1, 중2, 중3)
  const grades = await db
    .insert(schema.grades)
    .values([
      {
        subjectId: subjects[0].id,
        name: '중1',
        displayOrder: 1,
        schoolLevel: 'MIDDLE',
      },
      {
        subjectId: subjects[0].id,
        name: '중2',
        displayOrder: 2,
        schoolLevel: 'MIDDLE',
      },
      {
        subjectId: subjects[0].id,
        name: '중3',
        displayOrder: 3,
        schoolLevel: 'MIDDLE',
      },
    ])
    .returning();

  console.log('✅ Grades created:', grades.length);

  // 3. Chapters 생성 (학년별 실제 단원)
  const chapters = await db
    .insert(schema.chapters)
    .values([
      // 중1 단원 (7개)
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '소인수분해',
        orderIndex: 1,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '정수와 유리수',
        orderIndex: 2,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '문자와 식',
        orderIndex: 3,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '일차방정식',
        orderIndex: 4,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '기본도형',
        orderIndex: 5,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '입체도형',
        orderIndex: 6,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        name: '자료의 정리',
        orderIndex: 7,
      },
      // 중2 단원 (7개)
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '유리수와 순환소수',
        orderIndex: 1,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '식의 계산',
        orderIndex: 2,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '연립방정식',
        orderIndex: 3,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '일차함수',
        orderIndex: 4,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '삼각형의 성질',
        orderIndex: 5,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '도형의 닮음',
        orderIndex: 6,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        name: '확률',
        orderIndex: 7,
      },
      // 중3 단원 (7개)
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '제곱근과 실수',
        orderIndex: 1,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '인수분해',
        orderIndex: 2,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '이차방정식',
        orderIndex: 3,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '이차함수',
        orderIndex: 4,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '삼각비',
        orderIndex: 5,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '원의 성질',
        orderIndex: 6,
      },
      {
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        name: '통계',
        orderIndex: 7,
      },
    ])
    .returning();

  console.log('✅ Chapters created:', chapters.length);

  // 4. Problems 생성 (21개 단원 × 3문제씩, 총 63문제)
  const problems = await db
    .insert(schema.problems)
    .values([
      // === 중1 단원 (7개 × 3문제 = 21문제) ===

      // 중1-1. 소인수분해 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[0].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '24를 소인수분해하면?',
        option1: '2 × 12',
        option2: '2² × 6',
        option3: '2³ × 3',
        option4: '3 × 8',
        correctAnswer: '3',
        explanation: '24 = 8 × 3 = 2³ × 3입니다.',
        tags: '소인수분해,기본',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[0].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '두 수 12와 18의 최대공약수는?',
        option1: '2',
        option2: '3',
        option3: '6',
        option4: '36',
        correctAnswer: '3',
        explanation:
          '12 = 2² × 3, 18 = 2 × 3²이므로 최대공약수는 2 × 3 = 6입니다.',
        tags: '최대공약수,소인수분해',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[0].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '두 수 48과 72의 최소공배수는?',
        option1: '144',
        option2: '216',
        option3: '288',
        option4: '432',
        correctAnswer: '1',
        explanation:
          '48 = 2⁴ × 3, 72 = 2³ × 3²이므로 최소공배수는 2⁴ × 3² = 144입니다.',
        tags: '최소공배수,소인수분해',
      },

      // 중1-2. 정수와 유리수 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[1].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '(-8) + 5의 값은?',
        option1: '-13',
        option2: '-3',
        option3: '3',
        option4: '13',
        correctAnswer: '2',
        explanation:
          '절댓값이 큰 -8의 부호를 따라 8 - 5 = 3이고, 부호는 음수이므로 -3입니다.',
        tags: '정수,덧셈',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[1].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '(-3) × 4 ÷ (-2)의 값은?',
        option1: '-6',
        option2: '6',
        option3: '-24',
        option4: '24',
        correctAnswer: '2',
        explanation: '(-3) × 4 = -12, (-12) ÷ (-2) = 6입니다.',
        tags: '정수,사칙연산',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[1].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '(-1/2) + (3/4) - (1/3)의 값은?',
        option1: '-1/12',
        option2: '1/12',
        option3: '-5/12',
        option4: '5/12',
        correctAnswer: '1',
        explanation: '통분하면 (-6/12) + (9/12) - (4/12) = -1/12입니다.',
        tags: '유리수,분수계산',
      },

      // 중1-3. 문자와 식 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[2].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '3x + 2x를 간단히 하면?',
        option1: '5x',
        option2: '5x²',
        option3: '6x',
        option4: 'x⁵',
        correctAnswer: '1',
        explanation: '동류항끼리 모으면 (3 + 2)x = 5x입니다.',
        tags: '문자와식,동류항',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[2].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '2(x + 3)을 전개하면?',
        option1: '2x + 3',
        option2: '2x + 6',
        option3: 'x + 6',
        option4: '2x + 5',
        correctAnswer: '2',
        explanation: '분배법칙을 사용하면 2x + 6입니다.',
        tags: '문자와식,분배법칙',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[2].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: 'x = 3일 때, 2x² - 5x + 1의 값은?',
        option1: '4',
        option2: '5',
        option3: '6',
        option4: '7',
        correctAnswer: '1',
        explanation: '2(3²) - 5(3) + 1 = 18 - 15 + 1 = 4입니다.',
        tags: '문자와식,식의값',
      },

      // 중1-4. 일차방정식 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[3].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: 'x + 5 = 12를 풀면?',
        option1: 'x = 5',
        option2: 'x = 7',
        option3: 'x = 12',
        option4: 'x = 17',
        correctAnswer: '2',
        explanation: 'x = 12 - 5 = 7입니다.',
        tags: '일차방정식,기본',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[3].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '3x + 7 = 19를 풀면?',
        option1: 'x = 3',
        option2: 'x = 4',
        option3: 'x = 5',
        option4: 'x = 6',
        correctAnswer: '2',
        explanation: '3x = 19 - 7 = 12, x = 12 ÷ 3 = 4입니다.',
        tags: '일차방정식,이항',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[3].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '2(x - 3) = x + 1을 풀면?',
        option1: 'x = 5',
        option2: 'x = 6',
        option3: 'x = 7',
        option4: 'x = 8',
        correctAnswer: '3',
        explanation: '2x - 6 = x + 1, 2x - x = 1 + 6, x = 7입니다.',
        tags: '일차방정식,괄호풀기',
      },

      // 중1-5. 기본도형 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[4].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '직각은 몇 도인가?',
        option1: '45°',
        option2: '60°',
        option3: '90°',
        option4: '180°',
        correctAnswer: '3',
        explanation: '직각은 90°입니다.',
        tags: '각,기본도형',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[4].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '맞꼭지각의 크기는?',
        option1: '항상 다르다',
        option2: '항상 같다',
        option3: '합이 180°이다',
        option4: '합이 90°이다',
        correctAnswer: '2',
        explanation: '맞꼭지각은 항상 크기가 같습니다.',
        tags: '각,맞꼭지각',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[4].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '두 직선이 평행할 때, 엇각의 크기는?',
        option1: '항상 다르다',
        option2: '항상 같다',
        option3: '합이 180°이다',
        option4: '합이 90°이다',
        correctAnswer: '2',
        explanation: '평행선에서 엇각은 항상 크기가 같습니다.',
        tags: '평행선,엇각',
      },

      // 중1-6. 입체도형 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[5].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '정육면체의 면은 모두 몇 개인가?',
        option1: '4개',
        option2: '6개',
        option3: '8개',
        option4: '12개',
        correctAnswer: '2',
        explanation: '정육면체는 6개의 정사각형 면으로 이루어져 있습니다.',
        tags: '입체도형,정육면체',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[5].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '한 모서리의 길이가 3 cm인 정육면체의 부피는?',
        option1: '9 cm³',
        option2: '18 cm³',
        option3: '27 cm³',
        option4: '54 cm³',
        correctAnswer: '3',
        explanation: '정육면체의 부피 = 한 모서리³ = 3³ = 27 cm³입니다.',
        tags: '입체도형,부피',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[5].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '반지름이 3 cm인 구의 겉넓이는? (단, π는 그대로 둔다)',
        option1: '9π cm²',
        option2: '12π cm²',
        option3: '18π cm²',
        option4: '36π cm²',
        correctAnswer: '4',
        explanation: '구의 겉넓이 = 4πr² = 4π × 3² = 36π cm²입니다.',
        tags: '입체도형,구,겉넓이',
      },

      // 중1-7. 자료의 정리 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[6].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '다음 자료의 평균은? (2, 4, 6, 8)',
        option1: '4',
        option2: '5',
        option3: '6',
        option4: '7',
        correctAnswer: '2',
        explanation: '(2 + 4 + 6 + 8) ÷ 4 = 20 ÷ 4 = 5입니다.',
        tags: '평균,대푯값',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[6].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '다음 자료의 중앙값은? (1, 3, 5, 7, 9)',
        option1: '3',
        option2: '5',
        option3: '7',
        option4: '9',
        correctAnswer: '2',
        explanation:
          '자료를 순서대로 나열했을 때 가운데 값인 5가 중앙값입니다.',
        tags: '중앙값,대푯값',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[6].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '다음 자료의 최빈값은? (2, 3, 3, 4, 5, 5, 5, 6)',
        option1: '3',
        option2: '4',
        option3: '5',
        option4: '6',
        correctAnswer: '3',
        explanation: '가장 많이 나타난 값은 5(3회)입니다.',
        tags: '최빈값,대푯값',
      },

      // === 중2 단원 (7개 × 3문제 = 21문제) ===

      // 중2-1. 유리수와 순환소수 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[7].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '1/4를 소수로 나타내면?',
        option1: '0.2',
        option2: '0.25',
        option3: '0.4',
        option4: '0.5',
        correctAnswer: '2',
        explanation: '1 ÷ 4 = 0.25입니다.',
        tags: '유리수,소수',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[7].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '0.333...을 기약분수로 나타내면?',
        option1: '1/3',
        option2: '1/4',
        option3: '3/10',
        option4: '33/100',
        correctAnswer: '1',
        explanation: '0.333... = 1/3입니다.',
        tags: '순환소수,분수',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[7].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '0.272727...을 분수로 나타내면?',
        option1: '27/99',
        option2: '3/11',
        option3: '27/100',
        option4: '1/4',
        correctAnswer: '2',
        explanation: '0.272727... = 27/99 = 3/11입니다.',
        tags: '순환소수,분수변환',
      },

      // 중2-2. 식의 계산 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[8].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '3x × 2y를 간단히 하면?',
        option1: '5xy',
        option2: '6xy',
        option3: '6x + y',
        option4: '3x + 2y',
        correctAnswer: '2',
        explanation: '3 × 2 × x × y = 6xy입니다.',
        tags: '단항식,곱셈',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[8].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '(x + 3)(x + 2)를 전개하면?',
        option1: 'x² + 5x + 6',
        option2: 'x² + 6x + 5',
        option3: 'x² + x + 6',
        option4: 'x² + 6x + 6',
        correctAnswer: '1',
        explanation: 'x² + 2x + 3x + 6 = x² + 5x + 6입니다.',
        tags: '다항식,전개',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[8].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: 'x² - 9를 인수분해하면?',
        option1: '(x + 3)(x - 3)',
        option2: '(x - 3)(x - 3)',
        option3: '(x + 3)(x + 3)',
        option4: '인수분해 불가능',
        correctAnswer: '1',
        explanation:
          'a² - b² = (a + b)(a - b) 공식을 사용하면 (x + 3)(x - 3)입니다.',
        tags: '인수분해,곱셈공식',
      },

      // 중2-3. 연립방정식 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[9].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: 'x + y = 5, x - y = 1을 풀면?',
        option1: 'x = 2, y = 3',
        option2: 'x = 3, y = 2',
        option3: 'x = 4, y = 1',
        option4: 'x = 1, y = 4',
        correctAnswer: '2',
        explanation: '두 식을 더하면 2x = 6, x = 3. y = 5 - 3 = 2입니다.',
        tags: '연립방정식,가감법',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[9].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '2x + y = 7, x - y = 2를 풀면?',
        option1: 'x = 2, y = 3',
        option2: 'x = 3, y = 1',
        option3: 'x = 3, y = 2',
        option4: 'x = 4, y = 2',
        correctAnswer: '2',
        explanation: '두 식을 더하면 3x = 9, x = 3. y = 7 - 6 = 1입니다.',
        tags: '연립방정식,가감법',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[9].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '3x + 2y = 12, 2x - y = 1을 풀면?',
        option1: 'x = 1, y = 3',
        option2: 'x = 2, y = 3',
        option3: 'x = 3, y = 2',
        option4: 'x = 2, y = 1',
        correctAnswer: '2',
        explanation:
          '두 번째 식에서 y = 2x - 1을 첫 번째 식에 대입하면 3x + 2(2x - 1) = 12, 7x = 14, x = 2, y = 3입니다.',
        tags: '연립방정식,대입법',
      },

      // 중2-4. 일차함수 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[10].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: 'y = 2x + 3에서 x = 1일 때 y의 값은?',
        option1: '3',
        option2: '5',
        option3: '7',
        option4: '9',
        correctAnswer: '2',
        explanation: 'y = 2(1) + 3 = 5입니다.',
        tags: '일차함수,함숫값',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[10].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '일차함수 y = -3x + 6의 기울기는?',
        option1: '-3',
        option2: '3',
        option3: '6',
        option4: '-6',
        correctAnswer: '1',
        explanation: 'y = ax + b에서 기울기는 a = -3입니다.',
        tags: '일차함수,기울기',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[10].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '점 (1, 4)를 지나고 기울기가 2인 직선의 방정식은?',
        option1: 'y = 2x + 2',
        option2: 'y = 2x + 4',
        option3: 'y = 2x - 2',
        option4: 'y = 2x + 6',
        correctAnswer: '1',
        explanation: 'y - 4 = 2(x - 1)을 정리하면 y = 2x + 2입니다.',
        tags: '일차함수,직선의방정식',
      },

      // 중2-5. 삼각형의 성질 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[11].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '삼각형의 내각의 합은?',
        option1: '90°',
        option2: '180°',
        option3: '270°',
        option4: '360°',
        correctAnswer: '2',
        explanation: '모든 삼각형의 세 내각의 합은 180°입니다.',
        tags: '삼각형,내각의합',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[11].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText:
          '이등변삼각형의 두 밑각의 크기가 같을 때, 한 밑각이 50°이면 꼭지각은?',
        option1: '50°',
        option2: '60°',
        option3: '70°',
        option4: '80°',
        correctAnswer: '4',
        explanation: '꼭지각 = 180° - 50° - 50° = 80°입니다.',
        tags: '이등변삼각형,내각',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[11].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText:
          '직각삼각형에서 빗변의 길이가 5 cm, 한 변의 길이가 3 cm일 때 나머지 한 변의 길이는?',
        option1: '2 cm',
        option2: '3 cm',
        option3: '4 cm',
        option4: '5 cm',
        correctAnswer: '3',
        explanation:
          '피타고라스 정리: 5² = 3² + x², 25 = 9 + x², x² = 16, x = 4 cm입니다.',
        tags: '직각삼각형,피타고라스정리',
      },

      // 중2-6. 도형의 닮음 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[12].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '닮음비가 1:2인 두 도형에서 넓이의 비는?',
        option1: '1:2',
        option2: '1:4',
        option3: '2:4',
        option4: '1:8',
        correctAnswer: '2',
        explanation: '넓이의 비는 닮음비의 제곱이므로 1²:2² = 1:4입니다.',
        tags: '닮음,넓이의비',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[12].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '닮음비가 2:3인 두 직육면체의 부피의 비는?',
        option1: '2:3',
        option2: '4:9',
        option3: '8:27',
        option4: '16:81',
        correctAnswer: '3',
        explanation: '부피의 비는 닮음비의 세제곱이므로 2³:3³ = 8:27입니다.',
        tags: '닮음,부피의비',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[12].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText:
          '한 변의 길이가 6 cm인 정사각형과 닮음인 정사각형의 한 변의 길이가 9 cm일 때, 넓이의 비는?',
        option1: '2:3',
        option2: '3:4',
        option3: '4:9',
        option4: '36:81',
        correctAnswer: '3',
        explanation: '닮음비 = 6:9 = 2:3, 넓이의 비 = 2²:3² = 4:9입니다.',
        tags: '닮음,정사각형,넓이',
      },

      // 중2-7. 확률 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[13].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '주사위 1개를 던질 때 3이 나올 확률은?',
        option1: '1/2',
        option2: '1/3',
        option3: '1/4',
        option4: '1/6',
        correctAnswer: '4',
        explanation:
          '3이 나오는 경우의 수는 1, 전체 경우의 수는 6이므로 1/6입니다.',
        tags: '확률,기본',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[13].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '동전 2개를 던질 때 모두 앞면이 나올 확률은?',
        option1: '1/2',
        option2: '1/3',
        option3: '1/4',
        option4: '1/8',
        correctAnswer: '3',
        explanation:
          '전체 경우의 수는 4(앞앞, 앞뒤, 뒤앞, 뒤뒤), 모두 앞면인 경우는 1이므로 1/4입니다.',
        tags: '확률,여러번시행',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[13].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText:
          '1부터 10까지의 자연수 중에서 임의로 하나를 뽑을 때 소수일 확률은?',
        option1: '2/5',
        option2: '3/10',
        option3: '1/2',
        option4: '3/5',
        correctAnswer: '1',
        explanation: '소수는 2, 3, 5, 7로 4개이므로 4/10 = 2/5입니다.',
        tags: '확률,소수',
      },

      // === 중3 단원 (7개 × 3문제 = 21문제) ===

      // 중3-1. 제곱근과 실수 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[14].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '√16의 값은?',
        option1: '2',
        option2: '4',
        option3: '8',
        option4: '16',
        correctAnswer: '2',
        explanation: '4² = 16이므로 √16 = 4입니다.',
        tags: '제곱근,기본',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[14].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '√18 - √8을 간단히 하면?',
        option1: '√2',
        option2: '2√2',
        option3: '√10',
        option4: '3√2',
        correctAnswer: '1',
        explanation: '√18 = 3√2, √8 = 2√2이므로 3√2 - 2√2 = √2입니다.',
        tags: '제곱근,간단히하기',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[14].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '√2 × √8을 간단히 하면?',
        option1: '2',
        option2: '4',
        option3: '√16',
        option4: '8',
        correctAnswer: '2',
        explanation: '√2 × √8 = √16 = 4입니다.',
        tags: '제곱근,곱셈',
      },

      // 중3-2. 인수분해 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[15].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: 'x² - 4를 인수분해하면?',
        option1: '(x + 2)(x - 2)',
        option2: '(x - 2)(x - 2)',
        option3: '(x + 4)(x - 1)',
        option4: '인수분해 불가능',
        correctAnswer: '1',
        explanation:
          'a² - b² = (a + b)(a - b) 공식을 사용하면 (x + 2)(x - 2)입니다.',
        tags: '인수분해,차의제곱',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[15].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: 'x² + 6x + 9를 인수분해하면?',
        option1: '(x + 3)²',
        option2: '(x + 9)(x + 1)',
        option3: '(x + 3)(x + 3)',
        option4: '(x - 3)²',
        correctAnswer: '1',
        explanation: 'a² + 2ab + b² = (a + b)² 공식을 사용하면 (x + 3)²입니다.',
        tags: '인수분해,완전제곱식',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[15].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: 'x² + 5x + 6을 인수분해하면?',
        option1: '(x + 1)(x + 6)',
        option2: '(x + 2)(x + 3)',
        option3: '(x + 5)(x + 1)',
        option4: '인수분해 불가능',
        correctAnswer: '2',
        explanation:
          '합이 5, 곱이 6인 두 수는 2와 3이므로 (x + 2)(x + 3)입니다.',
        tags: '인수분해,이차식',
      },

      // 중3-3. 이차방정식 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[16].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: 'x² = 9의 해는?',
        option1: 'x = 3',
        option2: 'x = -3',
        option3: 'x = ±3',
        option4: 'x = 9',
        correctAnswer: '3',
        explanation: 'x = ±√9 = ±3입니다.',
        tags: '이차방정식,기본',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[16].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: 'x² - 5x + 6 = 0의 해는?',
        option1: 'x = 2, 3',
        option2: 'x = -2, -3',
        option3: 'x = 1, 6',
        option4: 'x = -1, -6',
        correctAnswer: '1',
        explanation:
          '인수분해하면 (x - 2)(x - 3) = 0이므로 x = 2 또는 x = 3입니다.',
        tags: '이차방정식,인수분해',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[16].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: 'x² + 4x - 5 = 0의 해는?',
        option1: 'x = 1, -5',
        option2: 'x = -1, 5',
        option3: 'x = 1, 5',
        option4: 'x = -1, -5',
        correctAnswer: '1',
        explanation:
          '인수분해하면 (x - 1)(x + 5) = 0이므로 x = 1 또는 x = -5입니다.',
        tags: '이차방정식,인수분해',
      },

      // 중3-4. 이차함수 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[17].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: 'y = x²의 그래프에서 x = 2일 때 y의 값은?',
        option1: '2',
        option2: '4',
        option3: '8',
        option4: '16',
        correctAnswer: '2',
        explanation: 'y = 2² = 4입니다.',
        tags: '이차함수,함숫값',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[17].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: 'y = 2x²의 그래프는 y = x²의 그래프와 비교할 때?',
        option1: 'x축 방향으로 2배 확대',
        option2: 'y축 방향으로 2배 확대',
        option3: 'x축 방향으로 1/2배 축소',
        option4: 'y축 방향으로 1/2배 축소',
        correctAnswer: '2',
        explanation: 'y = ax²에서 |a| > 1이면 y축 방향으로 확대됩니다.',
        tags: '이차함수,그래프변환',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[17].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: 'y = x² - 4x + 3의 그래프의 꼭짓점의 좌표는?',
        option1: '(2, -1)',
        option2: '(-2, -1)',
        option3: '(2, 1)',
        option4: '(-2, 1)',
        correctAnswer: '1',
        explanation: 'y = (x - 2)² - 1로 변형하면 꼭짓점은 (2, -1)입니다.',
        tags: '이차함수,꼭짓점',
      },

      // 중3-5. 삼각비 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[18].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: 'sin 30°의 값은?',
        option1: '1/2',
        option2: '√2/2',
        option3: '√3/2',
        option4: '1',
        correctAnswer: '1',
        explanation: 'sin 30° = 1/2입니다.',
        tags: '삼각비,특수각',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[18].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: 'cos 60°의 값은?',
        option1: '1/2',
        option2: '√2/2',
        option3: '√3/2',
        option4: '1',
        correctAnswer: '1',
        explanation: 'cos 60° = 1/2입니다.',
        tags: '삼각비,특수각',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[18].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText:
          '직각삼각형에서 빗변의 길이가 10, 한 예각의 크기가 30°일 때 이 각의 대변의 길이는?',
        option1: '5',
        option2: '5√2',
        option3: '5√3',
        option4: '10',
        correctAnswer: '1',
        explanation: '대변 = 빗변 × sin 30° = 10 × 1/2 = 5입니다.',
        tags: '삼각비,활용',
      },

      // 중3-6. 원의 성질 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[19].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '반지름이 5 cm인 원의 넓이는? (단, π는 그대로 둔다)',
        option1: '5π cm²',
        option2: '10π cm²',
        option3: '25π cm²',
        option4: '50π cm²',
        correctAnswer: '3',
        explanation: '원의 넓이 = πr² = π × 5² = 25π cm²입니다.',
        tags: '원,넓이',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[19].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText:
          '반지름이 6 cm인 원에서 중심각이 60°인 부채꼴의 호의 길이는? (단, π는 그대로 둔다)',
        option1: 'π cm',
        option2: '2π cm',
        option3: '3π cm',
        option4: '6π cm',
        correctAnswer: '2',
        explanation:
          '호의 길이 = 2πr × (중심각/360°) = 2π × 6 × (60/360) = 2π cm입니다.',
        tags: '원,부채꼴,호의길이',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[19].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '원에 내접하는 사각형에서 대각의 크기의 합은?',
        option1: '90°',
        option2: '120°',
        option3: '180°',
        option4: '360°',
        correctAnswer: '3',
        explanation: '원에 내접하는 사각형의 대각의 크기의 합은 180°입니다.',
        tags: '원,내접사각형',
      },

      // 중3-7. 통계 (3문제: 초/중/상)
      {
        subjectId: subjects[0].id,
        chapterId: chapters[20].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: '다음 자료의 평균은? (10, 20, 30, 40)',
        option1: '20',
        option2: '25',
        option3: '30',
        option4: '35',
        correctAnswer: '2',
        explanation: '(10 + 20 + 30 + 40) ÷ 4 = 100 ÷ 4 = 25입니다.',
        tags: '평균,통계',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[20].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText: '다음 자료의 분산은? (2, 4, 6, 8)',
        option1: '3',
        option2: '4',
        option3: '5',
        option4: '6',
        correctAnswer: '3',
        explanation:
          '평균은 5. 분산 = [(2-5)² + (4-5)² + (6-5)² + (8-5)²] / 4 = 20 / 4 = 5입니다.',
        tags: '분산,통계',
      },
      {
        subjectId: subjects[0].id,
        chapterId: chapters[20].id,
        questionType: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText: '다음 자료의 표준편차는? (1, 3, 5, 7, 9)',
        option1: '2',
        option2: '4',
        option3: '√8',
        option4: '√10',
        correctAnswer: '3',
        explanation:
          '평균은 5. 분산 = [(1-5)² + (3-5)² + (5-5)² + (7-5)² + (9-5)²] / 5 = 40/5 = 8, 표준편차 = √8입니다.',
        tags: '표준편차,분산,통계',
      },
    ])
    .returning();

  console.log('✅ Problems created:', problems.length);

  // 5. Test Sets 생성
  const testSets = await db
    .insert(schema.testSets)
    .values([
      {
        title: '중1 수학 중간고사',
        description: '중1 수학 수와 연산, 문자와 식 단원',
        subjectId: subjects[0].id,
        gradeId: grades[0].id,
        testType: 'MIDTERM',
        totalQuestions: 4,
        timeLimit: 30,
      },
      {
        title: '중2 수학 기말고사',
        description: '중2 수학 전체 범위',
        subjectId: subjects[0].id,
        gradeId: grades[1].id,
        testType: 'FINAL',
        totalQuestions: 5,
        timeLimit: 40,
      },
      {
        title: '중3 수학 모의고사',
        description: '중3 수학 이차방정식, 함수 단원',
        subjectId: subjects[0].id,
        gradeId: grades[2].id,
        testType: 'MOCK',
        totalQuestions: 4,
        timeLimit: 30,
      },
    ])
    .returning();

  console.log('✅ Test Sets created:', testSets.length);

  // 6. Test Set Problems 연결 (N:M)
  await db.insert(schema.testSetProblems).values([
    // 중1 중간고사 (수와 연산, 문자와 식)
    {
      testSetId: testSets[0].id,
      problemId: problems[0].id, // 중1-수와연산-1
      orderIndex: 1,
      score: 5,
    },
    {
      testSetId: testSets[0].id,
      problemId: problems[1].id, // 중1-수와연산-2
      orderIndex: 2,
      score: 5,
    },
    {
      testSetId: testSets[0].id,
      problemId: problems[2].id, // 중1-문자와식-1
      orderIndex: 3,
      score: 5,
    },
    {
      testSetId: testSets[0].id,
      problemId: problems[3].id, // 중1-문자와식-2
      orderIndex: 4,
      score: 5,
    },
    // 중2 기말고사 (각 단원에서 1문제씩)
    {
      testSetId: testSets[1].id,
      problemId: problems[10].id, // 중2-수와연산-1
      orderIndex: 1,
      score: 6,
    },
    {
      testSetId: testSets[1].id,
      problemId: problems[12].id, // 중2-식의계산-1
      orderIndex: 2,
      score: 6,
    },
    {
      testSetId: testSets[1].id,
      problemId: problems[14].id, // 중2-함수-1
      orderIndex: 3,
      score: 6,
    },
    {
      testSetId: testSets[1].id,
      problemId: problems[16].id, // 중2-기하-1
      orderIndex: 4,
      score: 6,
    },
    {
      testSetId: testSets[1].id,
      problemId: problems[18].id, // 중2-확률과통계-1
      orderIndex: 5,
      score: 6,
    },
    // 중3 모의고사 (이차방정식, 함수)
    {
      testSetId: testSets[2].id,
      problemId: problems[24].id, // 중3-이차방정식-1
      orderIndex: 1,
      score: 7,
    },
    {
      testSetId: testSets[2].id,
      problemId: problems[25].id, // 중3-이차방정식-2
      orderIndex: 2,
      score: 7,
    },
    {
      testSetId: testSets[2].id,
      problemId: problems[26].id, // 중3-함수-1
      orderIndex: 3,
      score: 8,
    },
    {
      testSetId: testSets[2].id,
      problemId: problems[27].id, // 중3-함수-2
      orderIndex: 4,
      score: 8,
    },
  ]);

  console.log('✅ Test Set Problems connected');
  console.log('🎉 Seed completed!');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
