# Seed 데이터 입력 방법

## 🚀 실행 명령어

### 로컬 환경

```bash
cd problem-bank-server
npm run db:reset
```

### EC2 환경

```bash
cd ~/problem-bank-server
npm run db:reset
```

## 📋 명령어 설명

| 명령어             | 동작                       |
| ------------------ | -------------------------- |
| `npm run db:reset` | 전체 삭제 후 재생성 (권장) |
| `npm run db:seed`  | 데이터 추가만 (기존 유지)  |

## ✅ 실행 결과

```
🗑️  Resetting database...
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
