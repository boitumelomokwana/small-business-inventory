import { Pool } from 'pg';
import { env } from './env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Database query completed', { duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Database query failed', { duration: Date.now() - start, err });
    throw err;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};
