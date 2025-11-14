# Seed 데이터 입력 방법

1. 모든 데이터 다시 입력
   npm run db:reset:all

## 🚀 실행 명령어

### 처음 실행 (테이블 생성 필요)

```bash
cd problem-bank-server
npm run db:push    # 테이블 생성
npm run db:seed    # 데이터 생성
```

### 이후 실행 (데이터 초기화)

```bash
cd problem-bank-server
npm run db:reset   # 데이터 삭제 + 재생성
```

### EC2 환경

```bash
cd ~/problem-bank-server

# 처음 실행
npm run db:push && npm run db:seed

# 이후 실행
npm run db:reset
```

## 📋 명령어 설명

| 명령어             | 동작                 | 사용 시점              |
| ------------------ | -------------------- | ---------------------- |
| `npm run db:push`  | 테이블 생성/수정     | 처음 or 스키마 변경 시 |
| `npm run db:seed`  | 데이터 추가          | 데이터 생성            |
| `npm run db:reset` | 데이터 삭제 + 재생성 | 초기화 필요 시         |

## ✅ 실행 결과

```
🗑️  Resetting database...
✓ Truncated user_attempts
✓ Truncated test_set_problems
✓ Truncated test_sets
✓ Truncated problems
✓ Truncated chapters
✓ Truncated grades
✓ Truncated subjects
✅ Database reset completed!

🌱 Starting seed...
✅ Subjects created: 2
✅ Grades created: 3
✅ Chapters created: 16
✅ Problems created: 5
✅ Test Sets created: 3
🎉 Seed completed!
```

## 📊 생성되는 데이터

- **과목**: 수학, 영어
- **학년**: 중1, 중2, 중3 (수학)
- **단원**: 각 학년별 5-6개
- **문제**: 샘플 5개
- **시험지**: 각 학년별 3개

## 🔧 환경변수 (선택)

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=user
export DB_PASSWORD=password
export DB_NAME=problem-bank
```

## 📝 관련 파일

- `scripts/seed.ts` - Seed 데이터 생성
- `scripts/reset-db.js` - DB 초기화
- `src/drizzle/schema.ts` - 스키마 정의
