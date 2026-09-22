import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pages (
      key TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const check = await pool.query('SELECT COUNT(*) FROM pages');
  console.log('✅ Table "pages" is ready.');
  console.log(`📊 Rows in table: ${check.rows[0].count}`);
  console.log('🎉 Your Sudd database is set up!');
} catch (err) {
  console.error('❌ Failed:', err.message);
} finally {
  await pool.end();
}