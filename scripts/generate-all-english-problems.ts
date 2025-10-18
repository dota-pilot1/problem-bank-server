import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/drizzle/schema-english';

// 중1 영어 7개 단원 × 5레벨 × 3문제 = 105문제 생성

async function generateAllEnglishProblems() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema });

  console.log('🌱 Starting English Problems Generation...');

  // 1. English Chapters 생성
  const chaptersData = [
    // 중1 (7단원)
    { gradeLevel: 1, name: 'be동사', orderIndex: 1 },
    { gradeLevel: 1, name: '일반동사', orderIndex: 2 },
    { gradeLevel: 1, name: '명사와 관사', orderIndex: 3 },
    { gradeLevel: 1, name: '대명사', orderIndex: 4 },
    { gradeLevel: 1, name: '형용사와 부사', orderIndex: 5 },
    { gradeLevel: 1, name: '전치사', orderIndex: 6 },
    { gradeLevel: 1, name: '의문사', orderIndex: 7 },

    // 중2 (7단원)
    { gradeLevel: 2, name: '시제', orderIndex: 1 },
    { gradeLevel: 2, name: '조동사', orderIndex: 2 },
    { gradeLevel: 2, name: '비교급과 최상급', orderIndex: 3 },
    { gradeLevel: 2, name: '부정사', orderIndex: 4 },
    { gradeLevel: 2, name: '동명사', orderIndex: 5 },
    { gradeLevel: 2, name: '접속사', orderIndex: 6 },
    { gradeLevel: 2, name: '문장의 형식', orderIndex: 7 },

    // 중3 (7단원)
    { gradeLevel: 3, name: '수동태', orderIndex: 1 },
    { gradeLevel: 3, name: '현재완료', orderIndex: 2 },
    { gradeLevel: 3, name: '관계대명사', orderIndex: 3 },
    { gradeLevel: 3, name: '가정법', orderIndex: 4 },
    { gradeLevel: 3, name: '분사', orderIndex: 5 },
    { gradeLevel: 3, name: '간접의문문', orderIndex: 6 },
    { gradeLevel: 3, name: '관계부사', orderIndex: 7 },
  ];

  const chapters = await db
    .insert(schema.englishChapters)
    .values(chaptersData)
    .returning();

  console.log('✅ English Chapters created:', chapters.length);

  const allProblems: any[] = [];

  // 중1 - be동사
  const ch1 = chapters.find((c) => c.gradeLevel === 1 && c.orderIndex === 1);
  if (ch1) {
    allProblems.push(
      // LEVEL_1
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'I ___ a student.', option1: 'am', option2: 'is', option3: 'are', option4: 'be', correctAnswer: '1', explanation: '주어가 I일 때 be동사는 am', tags: 'be동사,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'She ___ happy.', option1: 'is', option2: 'am', option3: 'are', option4: 'be', correctAnswer: '1', explanation: '주어가 3인칭 단수일 때 be동사는 is', tags: 'be동사,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'They ___ friends.', option1: 'are', option2: 'is', option3: 'am', option4: 'be', correctAnswer: '1', explanation: '주어가 복수일 때 be동사는 are', tags: 'be동사,중1영어' },
      // LEVEL_2
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: '___ you a teacher?', option1: 'Are', option2: 'Is', option3: 'Am', option4: 'Be', correctAnswer: '1', explanation: '의문문: Are you...?', tags: 'be동사,의문문,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'He ___ not here.', option1: 'is', option2: 'am', option3: 'are', option4: 'be', correctAnswer: '1', explanation: '부정문: He is not...', tags: 'be동사,부정문,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'We ___ students.', option1: 'are', option2: 'is', option3: 'am', option4: 'be', correctAnswer: '1', explanation: 'We are...', tags: 'be동사,중1영어' },
      // LEVEL_3
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: '___ she your sister?', option1: 'Is', option2: 'Are', option3: 'Am', option4: 'Be', correctAnswer: '1', explanation: 'Is she...? 의문문', tags: 'be동사,의문문,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'I ___ not tired.', option1: 'am', option2: 'is', option3: 'are', option4: 'be', correctAnswer: '1', explanation: 'I am not...', tags: 'be동사,부정문,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'This ___ my book.', option1: 'is', option2: 'am', option3: 'are', option4: 'be', correctAnswer: '1', explanation: 'This is...', tags: 'be동사,중1영어' },
      // LEVEL_4
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: '___ they from Korea?', option1: 'Are', option2: 'Is', option3: 'Am', option4: 'Be', correctAnswer: '1', explanation: 'Are they...?', tags: 'be동사,의문문,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'My parents ___ doctors.', option1: 'are', option2: 'is', option3: 'am', option4: 'be', correctAnswer: '1', explanation: '복수 주어 + are', tags: 'be동사,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'The book ___ on the desk.', option1: 'is', option2: 'am', option3: 'are', option4: 'be', correctAnswer: '1', explanation: '단수 주어 + is', tags: 'be동사,중1영어' },
      // LEVEL_5
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: '___ I late?', option1: 'Am', option2: 'Is', option3: 'Are', option4: 'Be', correctAnswer: '1', explanation: 'Am I...?', tags: 'be동사,의문문,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'The children ___ in the park.', option1: 'are', option2: 'is', option3: 'am', option4: 'be', correctAnswer: '1', explanation: 'children은 복수', tags: 'be동사,중1영어' },
      { chapterId: ch1.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'There ___ many people here.', option1: 'are', option2: 'is', option3: 'am', option4: 'be', correctAnswer: '1', explanation: 'There are + 복수명사', tags: 'be동사,중1영어' },
    );
  }

  // 중1 - 일반동사
  const ch2 = chapters.find((c) => c.gradeLevel === 1 && c.orderIndex === 2);
  if (ch2) {
    allProblems.push(
      // LEVEL_1
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'I ___ English.', option1: 'study', option2: 'studies', option3: 'studying', option4: 'studied', correctAnswer: '1', explanation: 'I + 동사원형', tags: '일반동사,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'He ___ soccer.', option1: 'plays', option2: 'play', option3: 'playing', option4: 'played', correctAnswer: '1', explanation: '3인칭 단수 + 동사s', tags: '일반동사,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'We ___ books.', option1: 'read', option2: 'reads', option3: 'reading', option4: 'readed', correctAnswer: '1', explanation: 'We + 동사원형', tags: '일반동사,중1영어' },
      // LEVEL_2
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: '___ you like pizza?', option1: 'Do', option2: 'Does', option3: 'Did', option4: 'Are', correctAnswer: '1', explanation: 'Do you + 동사원형?', tags: '일반동사,의문문,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'She ___ not speak Chinese.', option1: 'does', option2: 'do', option3: 'did', option4: 'is', correctAnswer: '1', explanation: 'She does not + 동사원형', tags: '일반동사,부정문,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'They ___ to school.', option1: 'go', option2: 'goes', option3: 'going', option4: 'went', correctAnswer: '1', explanation: 'They + 동사원형', tags: '일반동사,중1영어' },
      // LEVEL_3
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: '___ he watch TV?', option1: 'Does', option2: 'Do', option3: 'Did', option4: 'Is', correctAnswer: '1', explanation: 'Does he + 동사원형?', tags: '일반동사,의문문,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'I do not ___ meat.', option1: 'eat', option2: 'eats', option3: 'eating', option4: 'ate', correctAnswer: '1', explanation: 'do not + 동사원형', tags: '일반동사,부정문,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'My sister ___ the piano.', option1: 'plays', option2: 'play', option3: 'playing', option4: 'played', correctAnswer: '1', explanation: '3인칭 단수 + 동사s', tags: '일반동사,중1영어' },
      // LEVEL_4
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'What ___ you do?', option1: 'do', option2: 'does', option3: 'did', option4: 'are', correctAnswer: '1', explanation: 'What do you...?', tags: '일반동사,의문문,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'He does not ___ coffee.', option1: 'drink', option2: 'drinks', option3: 'drinking', option4: 'drank', correctAnswer: '1', explanation: 'does not + 동사원형', tags: '일반동사,부정문,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'Where ___ she live?', option1: 'does', option2: 'do', option3: 'did', option4: 'is', correctAnswer: '1', explanation: 'Where does she...?', tags: '일반동사,의문문,중1영어' },
      // LEVEL_5
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'How often ___ you exercise?', option1: 'do', option2: 'does', option3: 'did', option4: 'are', correctAnswer: '1', explanation: 'How often do you...?', tags: '일반동사,의문문,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'The sun ___ in the east.', option1: 'rises', option2: 'rise', option3: 'rising', option4: 'rose', correctAnswer: '1', explanation: '3인칭 단수 + 동사s', tags: '일반동사,중1영어' },
      { chapterId: ch2.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: '___ your parents work on weekends?', option1: 'Do', option2: 'Does', option3: 'Did', option4: 'Are', correctAnswer: '1', explanation: 'Do + 복수주어...?', tags: '일반동사,의문문,중1영어' },
    );
  }

  // 중1 - 명사와 관사 (ch3)
  const ch3 = chapters.find((c) => c.gradeLevel === 1 && c.orderIndex === 3);
  if (ch3) {
    allProblems.push(
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'I have ___ apple.', option1: 'an', option2: 'a', option3: 'the', option4: '-', correctAnswer: '1', explanation: '모음 앞에는 an', tags: '관사,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'She is ___ teacher.', option1: 'a', option2: 'an', option3: 'the', option4: '-', correctAnswer: '1', explanation: '자음 앞에는 a', tags: '관사,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'cats의 단수형은?', option1: 'cat', option2: 'cates', option3: 'caties', option4: 'catty', correctAnswer: '1', explanation: 'cat + s = cats', tags: '명사,복수,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'box의 복수형은?', option1: 'boxes', option2: 'boxs', option3: 'boxies', option4: 'boxen', correctAnswer: '1', explanation: 'x로 끝나면 es', tags: '명사,복수,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'I saw ___ elephant.', option1: 'an', option2: 'a', option3: 'the', option4: '-', correctAnswer: '1', explanation: 'elephant은 모음으로 시작', tags: '관사,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'baby의 복수형은?', option1: 'babies', option2: 'babys', option3: 'babyes', option4: 'babyies', correctAnswer: '1', explanation: '자음+y → ies', tags: '명사,복수,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'knife의 복수형은?', option1: 'knives', option2: 'knifes', option3: 'knifs', option4: 'knifves', correctAnswer: '1', explanation: 'f → ves', tags: '명사,복수,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: '___ sun is hot.', option1: 'The', option2: 'A', option3: 'An', option4: '-', correctAnswer: '1', explanation: '유일한 것에는 the', tags: '관사,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'woman의 복수형은?', option1: 'women', option2: 'womans', option3: 'womanes', option4: 'womanies', correctAnswer: '1', explanation: '불규칙 복수', tags: '명사,복수,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'child의 복수형은?', option1: 'children', option2: 'childs', option3: 'childes', option4: 'childies', correctAnswer: '1', explanation: '불규칙 복수', tags: '명사,복수,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'I play ___ piano.', option1: 'the', option2: 'a', option3: 'an', option4: '-', correctAnswer: '1', explanation: '악기 앞에는 the', tags: '관사,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'foot의 복수형은?', option1: 'feet', option2: 'foots', option3: 'footes', option4: 'footies', correctAnswer: '1', explanation: '불규칙 복수', tags: '명사,복수,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'sheep의 복수형은?', option1: 'sheep', option2: 'sheeps', option3: 'sheepes', option4: 'sheepies', correctAnswer: '1', explanation: '단복수 동일', tags: '명사,복수,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'I have ___ breakfast at 7.', option1: '-', option2: 'a', option3: 'an', option4: 'the', correctAnswer: '1', explanation: '식사 앞에는 관사 생략', tags: '관사,중1영어' },
      { chapterId: ch3.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'tooth의 복수형은?', option1: 'teeth', option2: 'tooths', option3: 'toothes', option4: 'toothies', correctAnswer: '1', explanation: '불규칙 복수', tags: '명사,복수,중1영어' },
    );
  }

  // 중1 - 대명사 (ch4) - 15문제
  const ch4 = chapters.find((c) => c.gradeLevel === 1 && c.orderIndex === 4);
  if (ch4) {
    allProblems.push(
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: '___ am a student. (나)', option1: 'I', option2: 'You', option3: 'He', option4: 'She', correctAnswer: '1', explanation: '나 = I', tags: '대명사,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'I love ___. (그를)', option1: 'him', option2: 'he', option3: 'his', option4: 'her', correctAnswer: '1', explanation: '목적격 = him', tags: '대명사,목적격,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'This is ___ book. (나의)', option1: 'my', option2: 'me', option3: 'I', option4: 'mine', correctAnswer: '1', explanation: '소유격 = my', tags: '대명사,소유격,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'The book is ___. (나의 것)', option1: 'mine', option2: 'my', option3: 'me', option4: 'I', correctAnswer: '1', explanation: '소유대명사 = mine', tags: '대명사,소유대명사,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'She loves ___. (나를)', option1: 'me', option2: 'I', option3: 'my', option4: 'mine', correctAnswer: '1', explanation: '목적격 = me', tags: '대명사,목적격,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: '___ name is Tom. (그의)', option1: 'His', option2: 'He', option3: 'Him', option4: 'He\'s', correctAnswer: '1', explanation: '소유격 = his', tags: '대명사,소유격,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'I know ___. (그녀를)', option1: 'her', option2: 'she', option3: 'hers', option4: 'her\'s', correctAnswer: '1', explanation: '목적격 = her', tags: '대명사,목적격,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'This pen is ___. (그의 것)', option1: 'his', option2: 'he', option3: 'him', option4: 'he\'s', correctAnswer: '1', explanation: '소유대명사 = his', tags: '대명사,소유대명사,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: '___ are friends. (우리는)', option1: 'We', option2: 'Us', option3: 'Our', option4: 'Ours', correctAnswer: '1', explanation: '주격 = we', tags: '대명사,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'The dog hurt ___. (그 자신을)', option1: 'itself', option2: 'himself', option3: 'herself', option4: 'themselves', correctAnswer: '1', explanation: '재귀대명사 = itself', tags: '대명사,재귀대명사,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'These books are ___. (그녀의 것)', option1: 'hers', option2: 'her', option3: 'she', option4: 'her\'s', correctAnswer: '1', explanation: '소유대명사 = hers', tags: '대명사,소유대명사,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'I made it ___. (혼자서)', option1: 'myself', option2: 'itself', option3: 'himself', option4: 'herself', correctAnswer: '1', explanation: '재귀대명사 = myself', tags: '대명사,재귀대명사,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'They enjoyed ___. (그들 자신을)', option1: 'themselves', option2: 'themself', option3: 'their', option4: 'theirs', correctAnswer: '1', explanation: '재귀대명사 복수 = themselves', tags: '대명사,재귀대명사,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: '___ car is faster than ___. (우리의, 그들의 것)', option1: 'Our, theirs', option2: 'We, them', option3: 'Ours, their', option4: 'Us, they', correctAnswer: '1', explanation: '소유격 + 소유대명사', tags: '대명사,중1영어' },
      { chapterId: ch4.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'She looked at ___ in the mirror.', option1: 'herself', option2: 'her', option3: 'hers', option4: 'she', correctAnswer: '1', explanation: '재귀대명사 = herself', tags: '대명사,재귀대명사,중1영어' },
    );
  }

  // 중1 - 형용사와 부사 (ch5) - 15문제
  const ch5 = chapters.find((c) => c.gradeLevel === 1 && c.orderIndex === 5);
  if (ch5) {
    allProblems.push(
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'She is ___. (아름다운)', option1: 'beautiful', option2: 'beautifully', option3: 'beauty', option4: 'beautify', correctAnswer: '1', explanation: '형용사 = beautiful', tags: '형용사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'He runs ___. (빠르게)', option1: 'fast', option2: 'quick', option3: 'fastly', option4: 'faster', correctAnswer: '1', explanation: '부사 = fast', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'This is a ___ book. (좋은)', option1: 'good', option2: 'well', option3: 'goodly', option4: 'better', correctAnswer: '1', explanation: '형용사 = good', tags: '형용사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'She speaks ___. (잘)', option1: 'well', option2: 'good', option3: 'better', option4: 'best', correctAnswer: '1', explanation: '부사 = well', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'He is a ___ student. (똑똑한)', option1: 'smart', option2: 'smartly', option3: 'smarter', option4: 'smartest', correctAnswer: '1', explanation: '형용사 = smart', tags: '형용사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'She sings ___. (아름답게)', option1: 'beautifully', option2: 'beautiful', option3: 'beauty', option4: 'beautify', correctAnswer: '1', explanation: '부사 = beautifully', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'I am ___ happy. (매우)', option1: 'very', option2: 'much', option3: 'many', option4: 'too', correctAnswer: '1', explanation: 'very + 형용사', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'This is ___ easy. (너무)', option1: 'too', option2: 'very', option3: 'so', option4: 'much', correctAnswer: '1', explanation: 'too + 형용사', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'He studies ___. (열심히)', option1: 'hard', option2: 'hardly', option3: 'hardily', option4: 'harder', correctAnswer: '1', explanation: '부사 = hard', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'She is ___ late. (거의 안)', option1: 'hardly', option2: 'hard', option3: 'nearly', option4: 'almost', correctAnswer: '1', explanation: 'hardly = 거의 ~않다', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'I ___ agree. (완전히)', option1: 'completely', option2: 'complete', option3: 'completing', option4: 'completion', correctAnswer: '1', explanation: '부사 = completely', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'He is ___ clever. (꽤)', option1: 'quite', option2: 'quiet', option3: 'quick', option4: 'quit', correctAnswer: '1', explanation: 'quite + 형용사', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'She speaks English ___. (유창하게)', option1: 'fluently', option2: 'fluent', option3: 'fluency', option4: 'more fluent', correctAnswer: '1', explanation: '부사 = fluently', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'It is ___ important. (매우)', option1: 'extremely', option2: 'extreme', option3: 'extremity', option4: 'extremes', correctAnswer: '1', explanation: '부사 = extremely', tags: '부사,중1영어' },
      { chapterId: ch5.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'He ___ comes here. (자주)', option1: 'often', option2: 'always', option3: 'never', option4: 'seldom', correctAnswer: '1', explanation: '빈도부사 = often', tags: '부사,중1영어' },
    );
  }

  // 중1 - 전치사 (ch6) - 15문제
  const ch6 = chapters.find((c) => c.gradeLevel === 1 && c.orderIndex === 6);
  if (ch6) {
    allProblems.push(
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'I am ___ home.', option1: 'at', option2: 'in', option3: 'on', option4: 'to', correctAnswer: '1', explanation: 'at home = 집에', tags: '전치사,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'The book is ___ the table.', option1: 'on', option2: 'at', option3: 'in', option4: 'to', correctAnswer: '1', explanation: 'on the table = 테이블 위에', tags: '전치사,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: 'I live ___ Seoul.', option1: 'in', option2: 'at', option3: 'on', option4: 'to', correctAnswer: '1', explanation: 'in + 도시', tags: '전치사,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'I go to school ___ bus.', option1: 'by', option2: 'on', option3: 'in', option4: 'with', correctAnswer: '1', explanation: 'by bus = 버스로', tags: '전치사,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'The meeting is ___ 3 PM.', option1: 'at', option2: 'in', option3: 'on', option4: 'to', correctAnswer: '1', explanation: 'at + 시각', tags: '전치사,시간,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: 'I will see you ___ Monday.', option1: 'on', option2: 'at', option3: 'in', option4: 'to', correctAnswer: '1', explanation: 'on + 요일', tags: '전치사,시간,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'She was born ___ 2010.', option1: 'in', option2: 'at', option3: 'on', option4: 'to', correctAnswer: '1', explanation: 'in + 년도', tags: '전치사,시간,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'I will come ___ two hours.', option1: 'in', option2: 'at', option3: 'on', option4: 'for', correctAnswer: '1', explanation: 'in + 시간 = ~후에', tags: '전치사,시간,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: 'The cat is ___ the box.', option1: 'in', option2: 'at', option3: 'on', option4: 'to', correctAnswer: '1', explanation: 'in the box = 상자 안에', tags: '전치사,장소,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'I have lived here ___ 5 years.', option1: 'for', option2: 'since', option3: 'in', option4: 'at', correctAnswer: '1', explanation: 'for + 기간', tags: '전치사,시간,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'She is good ___ math.', option1: 'at', option2: 'in', option3: 'on', option4: 'to', correctAnswer: '1', explanation: 'good at = ~을 잘하다', tags: '전치사,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: 'This is a gift ___ you.', option1: 'for', option2: 'to', option3: 'at', option4: 'in', correctAnswer: '1', explanation: 'for you = 너를 위한', tags: '전치사,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'I am interested ___ music.', option1: 'in', option2: 'at', option3: 'on', option4: 'to', correctAnswer: '1', explanation: 'interested in = ~에 관심있다', tags: '전치사,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'He is afraid ___ dogs.', option1: 'of', option2: 'at', option3: 'in', option4: 'to', correctAnswer: '1', explanation: 'afraid of = ~을 두려워하다', tags: '전치사,중1영어' },
      { chapterId: ch6.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: 'The train arrived ___ time.', option1: 'on', option2: 'at', option3: 'in', option4: 'for', correctAnswer: '1', explanation: 'on time = 정시에', tags: '전치사,중1영어' },
    );
  }

  // 중1 - 의문사 (ch7) - 15문제
  const ch7 = chapters.find((c) => c.gradeLevel === 1 && c.orderIndex === 7);
  if (ch7) {
    allProblems.push(
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: '___ are you? (누구)', option1: 'Who', option2: 'What', option3: 'Where', option4: 'When', correctAnswer: '1', explanation: 'Who = 누구', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: '___ is this? (무엇)', option1: 'What', option2: 'Who', option3: 'Where', option4: 'When', correctAnswer: '1', explanation: 'What = 무엇', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_1', questionText: '___ are you from? (어디)', option1: 'Where', option2: 'Who', option3: 'What', option4: 'When', correctAnswer: '1', explanation: 'Where = 어디', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: '___ is your birthday? (언제)', option1: 'When', option2: 'What', option3: 'Where', option4: 'Who', correctAnswer: '1', explanation: 'When = 언제', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: '___ do you go to school? (어떻게)', option1: 'How', option2: 'What', option3: 'Where', option4: 'When', correctAnswer: '1', explanation: 'How = 어떻게', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_2', questionText: '___ are you doing? (무엇을)', option1: 'What', option2: 'Who', option3: 'Where', option4: 'When', correctAnswer: '1', explanation: 'What are you doing?', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: '___ old are you? (몇 살)', option1: 'How', option2: 'What', option3: 'Where', option4: 'Who', correctAnswer: '1', explanation: 'How old = 몇 살', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: '___ book is this? (누구의)', option1: 'Whose', option2: 'Who', option3: 'What', option4: 'Which', correctAnswer: '1', explanation: 'Whose = 누구의', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_3', questionText: '___ do you like best? (어느)', option1: 'Which', option2: 'What', option3: 'Who', option4: 'Where', correctAnswer: '1', explanation: 'Which = 어느', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: '___ does it cost? (얼마)', option1: 'How much', option2: 'How many', option3: 'What', option4: 'Which', correctAnswer: '1', explanation: 'How much = 얼마', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: '___ books do you have? (몇 개의)', option1: 'How many', option2: 'How much', option3: 'What', option4: 'Which', correctAnswer: '1', explanation: 'How many + 복수명사', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_4', questionText: '___ is she crying? (왜)', option1: 'Why', option2: 'What', option3: 'How', option4: 'When', correctAnswer: '1', explanation: 'Why = 왜', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: '___ long does it take? (얼마나 오래)', option1: 'How', option2: 'What', option3: 'When', option4: 'Where', correctAnswer: '1', explanation: 'How long = 얼마나 오래', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: '___ far is it? (얼마나 멀리)', option1: 'How', option2: 'What', option3: 'Where', option4: 'When', correctAnswer: '1', explanation: 'How far = 얼마나 멀리', tags: '의문사,중1영어' },
      { chapterId: ch7.id, questionType: 'MULTIPLE_CHOICE', difficulty: 'LEVEL_5', questionText: '___ often do you exercise? (얼마나 자주)', option1: 'How', option2: 'What', option3: 'When', option4: 'Where', correctAnswer: '1', explanation: 'How often = 얼마나 자주', tags: '의문사,중1영어' },
    );
  }

  console.log('✅ English Problems prepared:', allProblems.length);

  if (allProblems.length > 0) {
    const problems = await db
      .insert(schema.englishProblems)
      .values(allProblems)
      .returning();

    console.log('✅ English Problems inserted:', problems.length);
  }

  await pool.end();
  console.log('🎉 English Problems Generation completed!');
}

generateAllEnglishProblems().catch(console.error);
