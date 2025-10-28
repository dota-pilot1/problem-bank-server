import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as listeningSchema from '../src/drizzle/schema-listening';

async function seedListeningScripts() {
  const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'user',
    password: 'password',
    database: 'problem-bank',
  });

  const db = drizzle(pool, { schema: listeningSchema });

  console.log('🌱 듣기 스크립트 카테고리 시딩 시작...');

  try {
    // 기존 카테고리 삭제 (개발용)
    await db.delete(listeningSchema.listeningScriptCategories);
    console.log('✅ 기존 카테고리 삭제 완료');

    // 카테고리 데이터
    const categories = [
      { name: '공항', emoji: '✈️', displayOrder: 0 },
      { name: '레스토랑', emoji: '🍽️', displayOrder: 1 },
      { name: '쇼핑', emoji: '🛍️', displayOrder: 2 },
      { name: '호텔', emoji: '🏨', displayOrder: 3 },
      { name: '병원', emoji: '🏥', displayOrder: 4 },
      { name: '학교', emoji: '📚', displayOrder: 5 },
      { name: '직장', emoji: '💼', displayOrder: 6 },
      { name: '일상생활', emoji: '🏠', displayOrder: 7 },
      { name: '오늘의 이슈', emoji: '📰', displayOrder: 8 },
      { name: '저장된 오늘의 이슈', emoji: '📌', displayOrder: 9 },
    ];

    // 카테고리 삽입
    for (const category of categories) {
      await db.insert(listeningSchema.listeningScriptCategories).values(category);
      console.log(`  ✅ 카테고리 추가: ${category.emoji} ${category.name}`);
    }

    console.log('🎉 듣기 스크립트 카테고리 시딩 완료!');
  } catch (error) {
    console.error('❌ 시딩 중 에러 발생:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedListeningScripts();
