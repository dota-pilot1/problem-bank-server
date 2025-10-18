#!/bin/bash

echo "🚀 Starting complete problem generation..."

# 1. DB 초기화
echo "📦 Step 1: Resetting database..."
npm run db:reset

# 2. 중1 수학 105문제
echo "📚 Step 2: Generating 중1 Math (105 problems)..."
npx ts-node scripts/generate-all-math-problems.ts

# 3. 중1 영어 105문제  
echo "📚 Step 3: Generating 중1 English (105 problems)..."
npx ts-node scripts/generate-all-english-problems.ts

# 4. 중2, 중3 수학 210문제
echo "📚 Step 4: Generating 중2, 중3 Math (210 problems)..."
npx ts-node scripts/generate-grade2-3-math.ts

# 5. 중2, 중3 영어 210문제
echo "📚 Step 5: Generating 중2, 중3 English (210 problems)..."
npx ts-node scripts/generate-grade2-3-english.ts

# 6. 결과 확인
echo "✅ Checking results..."
PGPASSWORD=password psql -h localhost -p 5433 -U user -d problem-bank << SQL
SELECT 'Math' as subject, COUNT(*) as total FROM math_problems
UNION ALL
SELECT 'English', COUNT(*) FROM english_problems;
SQL

echo "🎉 All problems generated successfully!"
