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
    // 각 테이블을 개별적으로 truncate (존재하지 않는 테이블은 무시)
    const tables = [
      'user_attempts',
      'test_set_problems',
      'test_sets',
      'problems',
      'chapters',
      'grades',
      'subjects',
    ];

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
