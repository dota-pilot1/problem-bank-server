# Seed 데이터 입력 방법

## 📝 개요

문제은행 시스템의 초기 데이터를 생성하는 방법을 설명합니다.

## 🗂️ 데이터 구조

```
과목 (Subject)
└── 학년 (Grade) - 중1, 중2, 중3, 고1, 고2, 고3
    └── 단원 (Chapter) - 학년별 단원
        └── 문제 (Problem) - 단원별 문제

시험지 (TestSet)
├── gradeId (어느 학년 시험인지)
└── testSetProblems (M:N)
    ├── problemId
    ├── orderIndex (문제 순서)
    └── score (배점)
```

## 🚀 Seed 데이터 실행 방법

### 1. 기본 실행 (기존 데이터 유지)

```bash
cd problem-bank-server
npm run db:seed
```

### 2. 데이터 초기화 후 실행 (권장) ✨

```bash
cd problem-bank-server
npm run db:reset
```

**`db:reset` 명령어는 다음을 자동으로 수행합니다:**

1. 기존 모든 데이터 삭제 (TRUNCATE)
2. Seed 데이터 재생성

**주의**: 이 명령어는 모든 데이터를 삭제하므로 운영 환경에서는 신중하게 사용하세요!

### 2. 실행 결과 확인

```bash
# PostgreSQL에 접속하여 데이터 확인
PGPASSWORD=password psql -h localhost -p 5433 -U user -d problem-bank

# 과목 및 학년 확인
SELECT s.name as subject, g.name as grade, g.display_order, COUNT(c.id) as chapter_count
FROM subjects s
LEFT JOIN grades g ON g.subject_id = s.id
LEFT JOIN chapters c ON c.grade_id = g.id
GROUP BY s.name, g.name, g.display_order
ORDER BY s.name, g.display_order;

# 시험지 확인
SELECT ts.title, g.name as grade, ts.test_type, ts.total_questions
FROM test_sets ts
LEFT JOIN grades g ON g.id = ts.grade_id;
```

## 📊 현재 생성되는 Seed 데이터

### 1. Subjects (과목)

- 수학
- 영어

### 2. Grades (학년) - 수학 과목

- 중1 (displayOrder: 1, schoolLevel: MIDDLE)
- 중2 (displayOrder: 2, schoolLevel: MIDDLE)
- 중3 (displayOrder: 3, schoolLevel: MIDDLE)

### 3. Chapters (단원)

**중1 수학 (5개 단원)**

1. 수와 연산
2. 문자와 식
3. 함수
4. 기하
5. 확률과 통계

**중2 수학 (5개 단원)**

1. 수와 연산
2. 식의 계산
3. 함수
4. 기하
5. 확률과 통계

**중3 수학 (6개 단원)**

1. 수와 연산
2. 다항식
3. 이차방정식
4. 함수
5. 기하
6. 통계

### 4. Problems (문제) - 샘플 5개

- 중1 수와 연산: 2+2=? (EASY)
- 중1 수와 연산: (-3)×4=? (MEDIUM)
- 중1 문자와 식: x+5=10 (MEDIUM)
- 중2 식의 계산: (x+2)(x+3) 전개 (MEDIUM)
- 중3 이차방정식: x²-5x+6=0 해 구하기 (HARD)

### 5. Test Sets (시험지) - 3개

- 중1 수학 중간고사 (3문제, 20점, 30분)
- 중2 수학 기말고사 (1문제, 10점, 40분)
- 중3 수학 모의고사 (1문제, 10점, 20분)

## 🔧 커스텀 Seed 데이터 추가 방법

### 파일 위치

`scripts/seed.ts`

### 예시: 고등학교 학년 추가

```typescript
// Grades 생성 부분에 추가
const grades = await db
  .insert(schema.grades)
  .values([
    // 중학교 (기존)
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

    // 고등학교 (새로 추가)
    {
      subjectId: subjects[0].id,
      name: '고1',
      displayOrder: 4,
      schoolLevel: 'HIGH',
    },
    {
      subjectId: subjects[0].id,
      name: '고2',
      displayOrder: 5,
      schoolLevel: 'HIGH',
    },
    {
      subjectId: subjects[0].id,
      name: '고3',
      displayOrder: 6,
      schoolLevel: 'HIGH',
    },
  ])
  .returning();

// 고1 단원 추가
const highSchoolChapters = await db
  .insert(schema.chapters)
  .values([
    {
      subjectId: subjects[0].id,
      gradeId: grades[3].id, // 고1
      name: '다항식',
      orderIndex: 1,
    },
    {
      subjectId: subjects[0].id,
      gradeId: grades[3].id,
      name: '방정식과 부등식',
      orderIndex: 2,
    },
    // ... 더 많은 단원 추가
  ])
  .returning();
```

### 예시: 문제 추가

```typescript
const newProblems = await db
  .insert(schema.problems)
  .values([
    {
      subjectId: subjects[0].id,
      chapterId: chapters[0].id, // 중1 수와 연산
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      questionText: '5 + 3 = ?',
      option1: '6',
      option2: '7',
      option3: '8',
      option4: '9',
      correctAnswer: '8',
      explanation: '5 더하기 3은 8입니다.',
      tags: '덧셈,기초',
    },
  ])
  .returning();
```

### 예시: 시험지 및 문제 매핑 추가

```typescript
// 시험지 생성
const newTestSet = await db
  .insert(schema.testSets)
  .values({
    title: '중1 수학 주간 테스트',
    description: '중1 수학 1주차 테스트',
    subjectId: subjects[0].id,
    gradeId: grades[0].id, // 중1
    testType: 'WEEKLY',
    totalQuestions: 5,
    timeLimit: 20,
  })
  .returning();

// 문제 매핑
await db.insert(schema.testSetProblems).values([
  {
    testSetId: newTestSet[0].id,
    problemId: problems[0].id,
    orderIndex: 1,
    score: 5,
  },
  {
    testSetId: newTestSet[0].id,
    problemId: problems[1].id,
    orderIndex: 2,
    score: 5,
  },
  // ... 더 많은 문제 매핑
]);
```

## 🗑️ 데이터 초기화 방법

### 전체 데이터 삭제 후 재생성

```bash
# PostgreSQL 접속
PGPASSWORD=password psql -h localhost -p 5433 -U user -d problem-bank

# 전체 테이블 삭제
DROP TABLE IF EXISTS user_attempts CASCADE;
DROP TABLE IF EXISTS test_set_problems CASCADE;
DROP TABLE IF EXISTS test_sets CASCADE;
DROP TABLE IF EXISTS problems CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TYPE IF EXISTS difficulty CASCADE;
DROP TYPE IF EXISTS question_type CASCADE;
DROP TYPE IF EXISTS test_type CASCADE;
DROP TYPE IF EXISTS school_level CASCADE;

# 종료
\q

# 서버 재시작 (자동으로 테이블 생성됨)
npm run start:dev

# Seed 데이터 다시 생성
npm run db:seed
```

## 📌 주의사항

1. **외래키 순서**: 반드시 Subject → Grade → Chapter → Problem 순서로 생성
2. **gradeId 필수**: Chapter 생성 시 gradeId는 필수 항목
3. **displayOrder**: Grade의 displayOrder는 UI에서 정렬 순서로 사용됨
4. **schoolLevel**: 'MIDDLE' 또는 'HIGH'만 사용 가능
5. **문제 타입**: 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER' 중 선택
6. **난이도**: 'EASY', 'MEDIUM', 'HARD' 중 선택
7. **시험 타입**: 'DAILY', 'WEEKLY', 'MONTHLY', 'MIDTERM', 'FINAL', 'MOCK' 중 선택

## 🔗 관련 파일

- **Seed 스크립트**: `scripts/seed.ts`
- **스키마 정의**: `src/drizzle/schema.ts`
- **마이그레이션**: `src/drizzle/migrations/`

## 📞 문제 해결

### Seed 실행 시 에러 발생

```bash
# 1. PostgreSQL 실행 확인
docker-compose ps

# 2. 데이터베이스 연결 확인
PGPASSWORD=password psql -h localhost -p 5433 -U user -d problem-bank -c "SELECT 1;"

# 3. 테이블 존재 확인
PGPASSWORD=password psql -h localhost -p 5433 -U user -d problem-bank -c "\dt"

# 4. 서버 로그 확인
tail -f server.log
```

### 외래키 제약조건 에러

- Subject가 먼저 생성되어 있는지 확인
- Grade가 생성된 후 Chapter 생성
- 올바른 ID 참조 여부 확인

### 중복 데이터 에러

- Seed 실행 전 기존 데이터 삭제
- 또는 중복 체크 로직 추가

---

**마지막 업데이트**: 2025-10-12
