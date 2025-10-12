const { Pool } = require('pg');

async function resetDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'problem-bank',
  });

  console.log('🗑️  Resetting database...');

  try {
    // Math 테이블
    const mathTables = [
      'math_user_attempts',
      'math_test_set_problems',
      'math_test_sets',
      'math_problems',
      'math_chapters',
    ];

    // English 테이블
    const englishTables = [
      'english_user_attempts',
      'english_test_set_problems',
      'english_test_sets',
      'english_problems',
      'english_chapters',
    ];

    // 구 스키마 테이블 (호환성)
    const oldTables = [
      'user_attempts',
      'test_set_problems',
      'test_sets',
      'problems',
      'chapters',
      'grades',
      'subjects',
    ];

    const tables = [...mathTables, ...englishTables, ...oldTables];

    for (const table of tables) {
      try {
        await pool.query(`TRUNCATE TABLE ${table} CASCADE;`);
        console.log(`✓ Truncated ${table}`);
      } catch (err) {
        if (err.code === '42P01') {
          console.log(`⚠ Table ${table} does not exist, skipping...`);
        } else {
          throw err;
        }
      }
    }

    console.log('✅ Database reset completed!');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();
