import { pool } from '../config/database';

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful, server time:', res.rows[0]);
  } catch (err) {
    console.error('Failed to connect to Neon:', err);
  } finally {
    await pool.end();
  }
})();
