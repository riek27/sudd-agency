import { Pool } from 'pg';

declare global {
  var _pgPool: Pool | undefined;
}

export const pool =
  global._pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== 'production') global._pgPool = pool;

// Helper with timeout so a slow DB doesn't hang the site
async function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

export async function getPage(key: string): Promise<any | null> {
  try {
    const result = await withTimeout(
      pool.query('SELECT data FROM pages WHERE key = $1', [key])
    );
    if (!result) {
      console.warn('DB query timed out for key:', key);
      return null;
    }
    return result.rows[0]?.data ?? null;
  } catch (error) {
    console.error('getPage error:', error);
    return null;
  }
}

export async function savePage(key: string, data: any): Promise<boolean> {
  try {
    await pool.query(
      `INSERT INTO pages (key, data) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()`,
      [key, data]
    );
    return true;
  } catch (error) {
    console.error('savePage error:', error);
    throw error;
  }
}