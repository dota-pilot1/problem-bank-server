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
    await pool.query(`
      TRUNCATE TABLE user_attempts CASCADE;
      TRUNCATE TABLE test_set_problems CASCADE;
      TRUNCATE TABLE test_sets CASCADE;
      TRUNCATE TABLE problems CASCADE;
      TRUNCATE TABLE chapters CASCADE;
      TRUNCATE TABLE grades CASCADE;
      TRUNCATE TABLE subjects CASCADE;
    `);

    console.log('✅ Database reset completed!');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();
