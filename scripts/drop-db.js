require('dotenv').config();
const { Client } = require('pg');

async function dropDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres', // Connect to default postgres DB
  });

  try {
    await client.connect();
    console.log('🗑️  Dropping and recreating database...');

    // Terminate all connections to the database
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'problem_bank'
      AND pid <> pg_backend_pid();
    `);

    // Drop database
    await client.query('DROP DATABASE IF EXISTS problem_bank');
    console.log('✓ Database dropped');

    // Create database
    await client.query('CREATE DATABASE problem_bank');
    console.log('✓ Database created');

    console.log('✅ Database reset completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

dropDatabase();
