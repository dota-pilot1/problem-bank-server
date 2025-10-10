# 문제은행 데이터베이스 설계 및 API 명세

## 📊 데이터베이스 설계

### ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│    subjects     │ (과목: 수학 개념, 수학 기본, 영어 듣기 등)
├─────────────────┤
│ id (PK)         │
│ name            │
│ description     │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐         ┌──────────────────────┐
│    problems     │         │   user_attempts      │
├─────────────────┤         ├──────────────────────┤
│ id (PK)         │◄────┐   │ id (PK)              │
│ subject_id (FK) │     │   │ user_id              │
│ question_type   │     └───│ problem_id (FK)      │
│ difficulty      │         │ user_answer          │
│ question_text   │         │ is_correct           │
│ option1         │         │ response_time_seconds│
│ option2         │         │ attempted_at         │
│ option3         │         └──────────────────────┘
│ option4         │
│ correct_answer  │
│ explanation     │
│ tags            │
│ is_active       │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## 🗂️ 테이블 명세

### 1. subjects (과목)

문제의 과목을 관리하는 테이블

| 컬럼명      | 타입         | 제약조건              | 설명                              |
| ----------- | ------------ | --------------------- | --------------------------------- |
| id          | SERIAL       | PRIMARY KEY           | 과목 ID                           |
| name        | VARCHAR(100) | NOT NULL, UNIQUE      | 과목명 (예: 수학 개념, 영어 듣기) |
| description | TEXT         |                       | 과목 설명                         |
| created_at  | TIMESTAMP    | NOT NULL, DEFAULT NOW | 생성 시간                         |
| updated_at  | TIMESTAMP    | NOT NULL, DEFAULT NOW | 수정 시간                         |

**예시 데이터:**

```json
[
  { "id": 1, "name": "수학 개념" },
  { "id": 2, "name": "수학 기본" },
  { "id": 3, "name": "수학 실전" },
  { "id": 4, "name": "영어 듣기" },
  { "id": 5, "name": "영어 독해" },
  { "id": 6, "name": "영어 단어" }
]
```

---

### 2. problems (문제)

실제 문제 데이터를 저장하는 핵심 테이블

| 컬럼명         | 타입         | 제약조건                   | 설명                         |
| -------------- | ------------ | -------------------------- | ---------------------------- |
| id             | SERIAL       | PRIMARY KEY                | 문제 ID                      |
| subject_id     | INTEGER      | NOT NULL, FK → subjects.id | 과목 ID                      |
| question_type  | ENUM         | NOT NULL                   | 문제 유형 (객관식/OX/주관식) |
| difficulty     | ENUM         | NOT NULL                   | 난이도 (쉬움/보통/어려움)    |
| question_text  | TEXT         | NOT NULL                   | 문제 내용                    |
| option1        | VARCHAR(500) |                            | 선택지 1                     |
| option2        | VARCHAR(500) |                            | 선택지 2                     |
| option3        | VARCHAR(500) |                            | 선택지 3                     |
| option4        | VARCHAR(500) |                            | 선택지 4                     |
| correct_answer | VARCHAR(500) | NOT NULL                   | 정답                         |
| explanation    | TEXT         |                            | 해설                         |
| tags           | TEXT         |                            | 태그 (콤마 구분)             |
| is_active      | BOOLEAN      | NOT NULL, DEFAULT TRUE     | 활성화 여부                  |
| created_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW      | 생성 시간                    |
| updated_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW      | 수정 시간                    |

**ENUM 정의:**

- `question_type`: `MULTIPLE_CHOICE` | `TRUE_FALSE` | `SHORT_ANSWER`
- `difficulty`: `EASY` | `MEDIUM` | `HARD`

---

### 3. user_attempts (사용자 시도 기록)

사용자의 문제 풀이 응답과 채점 데이터를 저장하는 테이블

| 컬럼명                | 타입         | 제약조건                   | 설명           |
| --------------------- | ------------ | -------------------------- | -------------- |
| id                    | SERIAL       | PRIMARY KEY                | 시도 ID        |
| user_id               | INTEGER      | NOT NULL                   | 사용자 ID      |
| problem_id            | INTEGER      | NOT NULL, FK → problems.id | 문제 ID        |
| user_answer           | VARCHAR(500) | NOT NULL                   | 사용자 답안    |
| is_correct            | BOOLEAN      | NOT NULL                   | 정답 여부      |
| response_time_seconds | INTEGER      |                            | 응답 시간 (초) |
| attempted_at          | TIMESTAMP    | NOT NULL, DEFAULT NOW      | 시도 시간      |

---

## 🚀 API 명세

### Base URL

```
http://localhost:8090
```

---

### 📌 Problems API

#### 1. 문제 생성

```http
POST /problems
Content-Type: application/json

{
  "subjectId": 1,
  "questionType": "MULTIPLE_CHOICE",
  "difficulty": "EASY",
  "questionText": "2 + 2 = ?",
  "option1": "3",
  "option2": "4",
  "option3": "5",
  "option4": "6",
  "correctAnswer": "4",
  "explanation": "2 더하기 2는 4입니다.",
  "tags": "덧셈,기초수학"
}
```

#### 2. 문제 목록 조회

```http
GET /problems
```

#### 3. 문제 단건 조회

```http
GET /problems/:id
```

#### 4. 문제 수정

```http
PATCH /problems/:id
Content-Type: application/json

{
  "difficulty": "MEDIUM",
  "explanation": "수정된 해설"
}
```

#### 5. 문제 삭제

```http
DELETE /problems/:id
```

---

## 🛠️ 테스트 방법

### Drizzle Studio (추천)

```bash
npm run db:studio
# → http://localhost:4983 접속하여 테이블 확인
```

### curl 예시

```bash
# 문제 생성
curl -X POST http://localhost:8090/problems \
  -H "Content-Type: application/json" \
  -d '{
    "subjectId": 1,
    "questionType": "MULTIPLE_CHOICE",
    "difficulty": "EASY",
    "questionText": "2 + 2 = ?",
    "option1": "3",
    "option2": "4",
    "correctAnswer": "4"
  }'

# 문제 목록 조회
curl http://localhost:8090/problems
```

---

## 📝 다음 단계

- [ ] Subjects CRUD API 구현
- [ ] User Attempts API 구현
- [ ] 필터링/검색 기능
- [ ] 페이지네이션
