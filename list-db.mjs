import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  const rows = await pool.query('SELECT key, updated_at FROM pages ORDER BY updated_at DESC');
  console.log(`📋 ${rows.rowCount} row(s) in pages table:\n`);
  rows.rows.forEach(r => console.log(`  • ${r.key}   (updated: ${r.updated_at})`));
} catch (err) {
  console.error('❌', err.message);
} finally {
  await pool.end();
}
